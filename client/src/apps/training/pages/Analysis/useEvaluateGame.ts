import { useTranslation } from "react-i18next";

import { AnalysedGame } from "wintrchess";
import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import evaluateMoves from "@apps/training/lib/evaluate";

function useEvaluateGame() {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const dispatchCurrentNodeUpdate = useAnalysisBoardStore(
        state => state.dispatchCurrentNodeUpdate
    );

    const {
        setAnalysisStatus,
        setEvaluationProgress,
        setAnalysisError
    } = useAnalysisProgressStore();

    async function evaluateGame(analysisGame: AnalysedGame) {
        setAnalysisStatus(AnalysisStatus.EVALUATING);

        // Generate evaluations for each position
        try {
            await evaluateMoves(
                analysisGame,
                {
                    engineVersion: settings.analysis.engine.version,
                    engineDepth: settings.analysis.engine.depth,
                    engineTimeLimit: settings.analysis.engine.timeLimitEnabled
                        ? settings.analysis.engine.timeLimit
                        : undefined,
                    cloudEngineLines: Math.max(2, settings.analysis.engine.lines),
                    maxEngineCount: 4,
                    engineConfig: engine => {
                        engine.setLineCount(settings.analysis.engine.lines);
                        engine.setThreadCount(settings.analysis.engine.threads);
                    },
                    onProgress: progress => {
                        setEvaluationProgress(progress);
                        dispatchCurrentNodeUpdate();
                    }
                }
            );

            setAnalysisStatus(AnalysisStatus.AWAITING_CAPTCHA);
        } catch (err) {
            console.error(err);

            setAnalysisError(
                t("pages.analysis.analysisError")
            );
        }
    }

    return evaluateGame;
}

export default useEvaluateGame;