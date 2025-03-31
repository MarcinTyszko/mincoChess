import { maxBy } from "lodash";

import {
    StateTreeNode,
    EngineVersion,
    GameAnalysis,
    getNodeChain
} from "wintrchess";
import analyse from "@lib/legacy/analyse";
import { EvaluatedPosition as LegacyBoardState } from "@lib/legacy/types/Position";

async function gameReport(stateTree: StateTreeNode) {
    // Convert state tree chain into legacy board states
    const stateTreeChain = getNodeChain(stateTree);
    const boardStates: LegacyBoardState[] = [];

    for (const node of stateTreeChain) {
        const hasCloudLines = node.state.engineLines.some(
            line => line.source == EngineVersion.LICHESS_CLOUD
        );

        const hasLocalLines = node.state.engineLines.some(
            line => line.source != EngineVersion.LICHESS_CLOUD
        );

        const topLocalLine = maxBy(
            node.state.engineLines.filter(
                line => line.source != EngineVersion.LICHESS_CLOUD
            ),
            line => line.depth - line.index
        )!;

        boardStates.push({
            fen: node.state.fen,
            move: {
                san: "e4",
                uci: "e2e4"
            },
            worker: hasCloudLines ? "cloud" : "local",
            topLines: node.state.engineLines.map(line => ({
                id: line.index,
                depth: line.depth,
                evaluation: {
                    type: line.evaluation.type == "centipawn" ? "cp" : "mate",
                    value: line.evaluation.value
                },
                moveSAN: node.state.move?.san,
                moveUCI: node.state.move?.uci || "e2e4"
            })),
            cutoffEvaluation: hasLocalLines
                ? {
                    type: topLocalLine.evaluation.type == "centipawn"
                        ? "cp" : "mate",
                    value: topLocalLine.evaluation.value
                }
                : undefined
        });
    }

    // Classify converted board states
    const legacyGameAnalysis = await analyse(boardStates);

    // Add classifications to each state tree node
    for (let i = 0; i < legacyGameAnalysis.positions.length; i++) {
        const currentStateTreeNode = stateTreeChain[i];
        const currentLegacyPosition = legacyGameAnalysis.positions[i];

        currentStateTreeNode.state.classification = currentLegacyPosition.classification;
    }

    // Construct game analyis object
    const parsedGameAnalysis: GameAnalysis = {
        accuracies: legacyGameAnalysis.accuracies,
        stateTree: stateTree
    };

    return parsedGameAnalysis;
}

export default gameReport;