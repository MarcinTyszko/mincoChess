import { useTranslation } from "react-i18next";

import { AnalysedGame } from "wintrchess";
import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import evaluateMoves from "@apps/training/lib/evaluate";

function useEvaluateGame() {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

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
                    engineVersion: settings.analysis.engine,
                    engineDepth: settings.analysis.engineDepth,
                    cloudEngineLines: Math.max(2, settings.analysis.engineLines),
                    maxEngineCount: 4,
                    engineConfig: engine => {
                        engine.setLineCount(2);
                        engine.setThreadCount(4);
                    },
                    onProgress: setEvaluationProgress
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