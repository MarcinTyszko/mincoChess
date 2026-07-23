import { useTranslation } from "react-i18next";

import AnalysedGame from "shared/types/game/AnalysedGame";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import {
    evaluateGameOnServer,
    SERVER_EVAL_UNAUTHORIZED
} from "@analysis/lib/serverEvaluate";

/**
 * @description Evaluate every position of the game on the server's
 * Stockfish instead of in the browser. Lichess cloud evaluations are
 * still applied first, exactly like in browser evaluation, so common
 * theory positions never hit the server engine. Engine lines have the
 * same shape as local ones, keeping the classification stage unchanged.
 */
function useServerEvaluateGame() {
    const { t } = useTranslation("analysis");

    const settings = useSettingsStore(
        state => state.settings.analysis.engine
    );

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
        setEvaluationProgress(0);

        const controller = new AbortController();

        evaluateGameOnServer(
            analysisGame,
            settings,
            controller,
            {
                onProgress: setEvaluationProgress,
                onNodesEvaluated: dispatchCurrentNodeUpdate
            }
        ).then(() => {
            if (controller.signal.aborted) return;

            setAnalysisStatus(AnalysisStatus.AWAITING_CAPTCHA);
        }).catch(err => {
            if (controller.signal.aborted) return;

            console.error(err);
            setAnalysisError(
                (err as Error).message == SERVER_EVAL_UNAUTHORIZED
                    ? t("serverAnalysis.signInRequired")
                    : t("serverAnalysis.failed")
            );
        });

        return controller;
    }

    return evaluateGame;
}

export default useServerEvaluateGame;
