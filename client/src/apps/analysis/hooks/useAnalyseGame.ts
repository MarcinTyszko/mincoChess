import { useTranslation } from "react-i18next";
import { StatusCodes } from "http-status-codes";

import { findNodeRecursively } from "wintrchess";
import AnalysisStatus from "@apps/analysis/constants/AnalysisStatus";
import { useAltcha } from "@hooks/useAltcha";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/analysis/stores/AnalysisProgressStore";
import { analyseStateTree } from "@apps/analysis/lib/reporter";

function useAnalyseGame(
    onAnalysisError?: (message: string) => void
) {
    const { t } = useTranslation();

    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        analysisGame,
        setAnalysisGame
    } = useAnalysisGameStore();

    const setCurrentStateTreeNode = useAnalysisBoardStore(
        state => state.setCurrentStateTreeNode
    );

    const setAnalysisStatus = useAnalysisProgressStore(
        state => state.setAnalysisStatus
    );

    const executeCaptcha = useAltcha();

    return async () => {
        const analyseResult = await analyseStateTree(analysisGame.stateTree, {
            includeBrilliant: settings.classifications.included.brilliant,
            includeCritical: settings.classifications.included.critical,
            includeTheory: settings.classifications.included.theory
        });

        // For any errors, display message or reset CAPTCHA
        if (analyseResult.status == StatusCodes.UNAUTHORIZED) {
            return executeCaptcha();
        } else if (analyseResult.status != StatusCodes.OK) {
            return onAnalysisError?.(
                t("pages.analysis.progressReporter.reportFailed")
            );
        }

        if (!analyseResult.gameAnalysis) {
            return setAnalysisStatus(AnalysisStatus.INACTIVE);
        }

        // Update analysed game with new analysis object
        setAnalysisGame({
            ...analysisGame,
            ...analyseResult.gameAnalysis
        });

        // Set current state tree node to equivalent in new tree
        setCurrentStateTreeNode(prev => {
            if (!analyseResult.gameAnalysis) {
                return prev;
            }

            return findNodeRecursively(
                analyseResult.gameAnalysis.stateTree,
                node => node.id == prev.id
            ) || prev;
        });

        setAnalysisStatus(AnalysisStatus.INACTIVE);
    };
}

export default useAnalyseGame;