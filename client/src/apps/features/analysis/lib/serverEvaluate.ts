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
import getCloudEvaluation from "./cloudEvaluate";

// The server evaluates this many positions per request
const BATCH_SIZE = 24;

// The endpoint accepts depths within 8..24
const MAX_SERVER_DEPTH = 24;
const MIN_SERVER_DEPTH = 8;

/**
 * @description Thrown when the user is not signed in; the server engine
 * is only available to accounts, so callers can prompt a sign-in.
 */
export const SERVER_EVAL_UNAUTHORIZED = "server-eval-unauthorized";

/**
 * @description Thrown for any other server evaluation failure.
 */
export const SERVER_EVAL_FAILED = "server-eval-failed";

export interface ServerEvaluationOptions {
    depth: number;
    lines: number;
    timeLimitEnabled: boolean;
    timeLimit: number;
}

export interface ServerEvaluationHandlers {
    /** Called with overall progress from 0 to 1 as positions are done */
    onProgress?: (progress: number) => void;
    /** Called after each batch of nodes gains its engine lines */
    onNodesEvaluated?: () => void;
}

/**
 * @description Evaluate every position of a game on the server's
 * Stockfish, applying Lichess cloud evaluations first exactly like the
 * browser evaluator so common theory positions never hit the server
 * engine. Engine lines share the shape of local ones, leaving the
 * classification stage unchanged. Mutates the game's state tree in place.
 *
 * Shared by the manual "analysis on the server" button and the automatic
 * background analysis of recent games, so both behave identically.
 */
export async function evaluateGameOnServer(
    game: AnalysedGame,
    options: ServerEvaluationOptions,
    controller: AbortController,
    handlers?: ServerEvaluationHandlers
): Promise<void> {
    const stateTreeNodes = getNodeChain(game.stateTree);

    let evaluatedCount = 0;

    function reportNodesEvaluated(count: number) {
        evaluatedCount += count;

        handlers?.onProgress?.(round(
            Math.min(evaluatedCount / stateTreeNodes.length, 1), 3
        ));

        handlers?.onNodesEvaluated?.();
    }

    // Same cloud pass as browser evaluation: walk from the start,
    // stopping at the first position the cloud does not know well
    // enough, and return the nodes still needing the server engine.
    async function applyCloudEvaluations(): Promise<StateTreeNode[]> {
        for (const [ index, node ] of stateTreeNodes.entries()) {
            if (controller.signal.aborted) return [];

            try {
                var cloudEngineLines = await getCloudEvaluation(
                    node.state.fen, options.lines
                );
            } catch {
                return stateTreeNodes.slice(index);
            }

            const topCloudLine = getTopEngineLine(cloudEngineLines);

            if (
                !topCloudLine
                || topCloudLine.depth < options.depth
                || cloudEngineLines.length < options.lines
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
                        positions: batchNodes.map(node => node.state.fen),
                        depth: Math.max(
                            MIN_SERVER_DEPTH,
                            Math.min(options.depth, MAX_SERVER_DEPTH)
                        ),
                        lines: options.lines,
                        timeLimit: options.timeLimitEnabled
                            ? options.timeLimit * 1000
                            : undefined
                    })
                }
            );

            if (evaluationResponse.status == StatusCodes.UNAUTHORIZED)
                throw new Error(SERVER_EVAL_UNAUTHORIZED);

            if (!evaluationResponse.ok)
                throw new Error(SERVER_EVAL_FAILED);

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

    const remainingNodes = await applyCloudEvaluations();

    await evaluateOnServer(remainingNodes);
}
