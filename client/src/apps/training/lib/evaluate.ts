import { Chess } from "chess.js";
import { sum, round } from "lodash";

import {
    EngineLine,
    AnalysedGame,
    StateTreeNode,
    EngineVersion,
    Move,
    getNodeChain,
    lichessCastlingMoves
} from "wintrchess";
import Engine from "@apps/training/lib/engine";
import { EvaluateMovesError } from "@lib/errors";

interface EvaluateMovesOptions {
    engineVersion: EngineVersion;
    maxEngineCount?: number;
    engineDepth: number;
    engineMoveTime?: number;
    cloudEngineLines: number;
    engineConfig?: (engine: Engine) => void;
    onProgress?: (progress: number) => void;
    verbose?: boolean;
}

/**
 * @throws {EvaluateMovesError}
 */
async function evaluateMoves(
    game: AnalysedGame,
    options: EvaluateMovesOptions
): Promise<StateTreeNode[]> {
    const stateTreeNodes: StateTreeNode[] = getNodeChain(game.stateTree);

    // Each state tree node keeps a progress from 0 to 1
    const progresses: number[] = [];

    const progress = () => round(sum(progresses) / stateTreeNodes.length, 3);

    // Apply cloud evaluations where possible
    for (const stateTreeNode of stateTreeNodes) {
        // Fetch cloud evaluation from Lichess servers
        try {
            var cloudEvaluationResponse = await fetch(
                "https://lichess.org/api/cloud-eval"
                    + `?fen=${stateTreeNode.state.fen}`
                    + `&multiPv=${Math.max(2, options.cloudEngineLines || 2)}`
            );
        } catch {
            break;
        }

        if (options.verbose) {
            console.log(`sending cloud evaluation request for: ${stateTreeNode.state.fen}`);
        }

        // If no evaluations or found / other error, skip to local
        if (!cloudEvaluationResponse.ok) {
            break;
        }

        const cloudEvaluation = await cloudEvaluationResponse.json();

        // Depth must be at least as configured by user
        if (cloudEvaluation.depth < options.engineDepth) {
            break;
        }

        // Line count must be at least as configured by user
        if (cloudEvaluation.pvs.length < options.cloudEngineLines) {
            break;
        }

        const engineLines: EngineLine[] = [];

        // Parse each variation as our engine lines
        for (const variation of cloudEvaluation.pvs) {
            const variationBoard = new Chess(stateTreeNode.state.fen);

            const lineMoves: Move[] = [];

            for (let uciMove of variation.moves.split(" ")) {
                if (Object.keys(lichessCastlingMoves).includes(uciMove)) {
                    uciMove = lichessCastlingMoves[uciMove];
                }

                try {
                    const parsedMove = variationBoard.move(uciMove);

                    lineMoves.push({
                        san: parsedMove.san,
                        uci: parsedMove.lan
                    });
                } catch {
                    break;
                }
            }

            engineLines.push({
                evaluation: {
                    type: (variation.cp == undefined) ? "mate" : "centipawn",
                    value: parseFloat(variation.cp ?? variation.mate)
                },
                source: EngineVersion.LICHESS_CLOUD,
                depth: parseInt(cloudEvaluation.depth),
                index: parseInt(cloudEvaluation.pvs.indexOf(variation)) + 1,
                moves: lineMoves
            });
        }

        stateTreeNode.state.engineLines.push(...engineLines);

        progresses.push(1);
        options.onProgress?.(progress());
    }

    // Locally evaluate remaining positions

    // Maximum engine count or however many are needed for each
    // remaining position, add 1 for cutoff for last cloud evaluated state
    const evaluatedStateCount = stateTreeNodes.filter(
        node => node.state.engineLines.some(
            line => line.source == EngineVersion.LICHESS_CLOUD
        )
    ).length;

    const engineCount = Math.min(
        options.maxEngineCount || 1,
        (stateTreeNodes.length - evaluatedStateCount) + 1
    );

    return new Promise((res, rej) => {
        let enginesResting = 0;
        let stateTreeNodeIndex = Math.max(evaluatedStateCount - 1, 0);

        // Bring an engine to a new FEN
        function evaluateNextPosition(engine: Engine) {
            const currentStateTreeNodeIndex = stateTreeNodeIndex;
            const currentStateTreeNode = stateTreeNodes[stateTreeNodeIndex];

            if (stateTreeNodeIndex >= stateTreeNodes.length) {
                engine.terminate();

                if (++enginesResting == engineCount) {
                    res(stateTreeNodes);
                }

                return;
            }

            engine.setPosition(
                game.initialPosition,
                stateTreeNodes
                    .slice(0, stateTreeNodeIndex + 1)
                    .filter(node => node.state.move)
                    .map(node => node.state.move!.uci)
            );

            engine.evaluate({
                depth: options.engineDepth,
                maxTime: options.engineMoveTime
                    ? options.engineMoveTime * 1000
                    : undefined,
                onEngineLine: line => {
                    // Depth 0 is given for states with no legal moves
                    const localProgress = line.depth == 0
                        ? 1 : line.depth / options.engineDepth;
                    
                    // Progress value will already exist for cutoff node
                    progresses[currentStateTreeNodeIndex] = Math.max(
                        progresses[currentStateTreeNodeIndex] || 0,
                        localProgress
                    );

                    options.onProgress?.(progress());
                }
            }).then(result => {
                progresses[currentStateTreeNodeIndex] = 1;

                currentStateTreeNode.state.engineLines.push(
                    ...result.lines
                );

                evaluateNextPosition(engine);
            });

            stateTreeNodeIndex++;
        }

        // Start engines on first positions
        for (let i = 0; i < engineCount; i++) {
            const engine = new Engine(options.engineVersion);

            options.engineConfig?.(engine);

            if (options.verbose) {
                engine.onMessage(console.log);
            }

            engine.onError(() => rej(
                new EvaluateMovesError("engine failed to evaluate position.")
            ));

            evaluateNextPosition(engine);
        }
    });
}

export default evaluateMoves;