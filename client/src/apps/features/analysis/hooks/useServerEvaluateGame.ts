import { useTranslation } from "react-i18next";
import { StatusCodes } from "http-status-codes";
import { round } from "lodash-es";

import AnalysedGame from "shared/types/game/AnalysedGame";
import {
    EngineLine,
    getTopEngineLine
} from "shared/types/game/position/EngineLine";
import {
    StateTreeNode,
    getNodeChain
} from "shared/types/game/position/StateTreeNode";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import getCloudEvaluation from "@analysis/lib/cloudEvaluate";

const BATCH_SIZE = 24;

// The endpoint accepts depths within 8..24
const MAX_SERVER_DEPTH = 24;

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
        const stateTreeNodes = getNodeChain(analysisGame.stateTree);

        let evaluatedCount = 0;

        function reportNodesEvaluated(count: number) {
            evaluatedCount += count;

            setEvaluationProgress(round(
                Math.min(evaluatedCount / stateTreeNodes.length, 1), 3
            ));

            dispatchCurrentNodeUpdate();
        }

        /**
         * @description Same cloud pass as browser evaluation: walk the
         * game from the start, stopping at the first position the cloud
         * does not know well enough. Returns the remaining nodes.
         */
        async function applyCloudEvaluations() {
            for (const [index, node] of stateTreeNodes.entries()) {
                if (controller.signal.aborted) return [];

                try {
                    var cloudEngineLines = await getCloudEvaluation(
                        node.state.fen, settings.lines
                    );
                } catch {
                    return stateTreeNodes.slice(index);
                }

                const topCloudLine = getTopEngineLine(cloudEngineLines);

                if (
                    !topCloudLine
                    || topCloudLine.depth < settings.depth
                    || cloudEngineLines.length < settings.lines
                ) return stateTreeNodes.slice(index);

                node.state.engineLines = [
                    ...node.state.engineLines,
                    ...cloudEngineLines
                ];

                reportNodesEvaluated(1);
            }

            return [];
        }

        async function evaluateOnServer(nodes: StateTreeNode[]) {
            for (
                let batchStart = 0;
                batchStart < nodes.length;
                batchStart += BATCH_SIZE
            ) {
                if (controller.signal.aborted) return;

                const batchNodes = nodes.slice(
                    batchStart, batchStart + BATCH_SIZE
                );

                const evaluationResponse = await fetch(
                    "/api/analysis/server-evaluate",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        signal: controller.signal,
                        body: JSON.stringify({
                            positions: batchNodes.map(
                                node => node.state.fen
                            ),
                            depth: Math.min(
                                settings.depth, MAX_SERVER_DEPTH
                            ),
                            lines: settings.lines,
                            timeLimit: settings.timeLimitEnabled
                                ? settings.timeLimit * 1000
                                : undefined
                        })
                    }
                );

                if (evaluationResponse.status == StatusCodes.UNAUTHORIZED)
                    throw new Error(t("serverAnalysis.signInRequired"));

                if (!evaluationResponse.ok)
                    throw new Error(t("serverAnalysis.failed"));

                const { evaluations }: { evaluations: EngineLine[][] }
                    = await evaluationResponse.json();

                batchNodes.forEach((node, nodeIndex) => {
                    node.state.engineLines = [
                        ...node.state.engineLines,
                        ...(evaluations[nodeIndex] || [])
                    ];
                });

                reportNodesEvaluated(batchNodes.length);
            }
        }

        async function evaluator() {
            const remainingNodes = await applyCloudEvaluations();

            await evaluateOnServer(remainingNodes);

            if (controller.signal.aborted) return;

            setAnalysisStatus(AnalysisStatus.AWAITING_CAPTCHA);
        }

        evaluator().catch(err => {
            if (controller.signal.aborted) return;

            console.error(err);
            setAnalysisError(
                (err as Error).message || t("analysisError")
            );
        });

        return controller;
    }

    return evaluateGame;
}

export default useServerEvaluateGame;
