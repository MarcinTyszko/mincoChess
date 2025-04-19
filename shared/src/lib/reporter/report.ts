import {
    StateTreeNode,
    getNodeChain
} from "@ctypes/game/position/StateTreeNode";
import ReportOptions from "./types/ReportOptions";
import {
    extractCurrentStateTreeNode,
    extractPreviousStateTreeNode
} from "./utils/extractNode";
import { getMoveAccuracy } from "./accuracy/moveAccuracy";
import { classify } from "./classify";
import { GameAnalysis } from "@ctypes/game/GameAnalysis";

export function getGameReport(
    rootNode: StateTreeNode,
    options?: ReportOptions
): GameAnalysis {
    const treeNodes = getNodeChain(rootNode);
    
    // Apply classifications and accuracies to moves
    for (const node of treeNodes) {
        try {
            node.state.classification = classify(node, options);
        } catch {
            node.state.classification = undefined;
        }

        if (!node.parent) continue;

        const previous = extractPreviousStateTreeNode(node.parent);
        const current = extractCurrentStateTreeNode(node);

        if (!previous || !current) continue;

        node.state.accuracy = getMoveAccuracy(
            previous.evaluation,
            current.evaluation,
            current.moveColour
        );
    }

    return {
        estimatedRatings: {
            white: 2000,
            black: 1000
        },
        stateTree: rootNode
    };
}