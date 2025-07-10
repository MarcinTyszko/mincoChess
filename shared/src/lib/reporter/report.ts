import { GameAnalysis } from "@ctypes/game/GameAnalysis";
import { StateTreeNode, getNodeChain } from "@ctypes/game/position/StateTreeNode";
import ReportOptions from "./types/ReportOptions";
import { adaptPieceColour } from "@constants/PieceColour";
import {
    extractCurrentStateTreeNode,
    extractPreviousStateTreeNode
} from "./utils/extractNode";
import { getMoveAccuracy } from "./accuracy/moveAccuracy";
import { classify } from "./classify";
import { getOpeningName } from "./utils/opening";

export function getGameReport(
    rootNode: StateTreeNode,
    options?: ReportOptions
): GameAnalysis {
    const treeNodes = getNodeChain(rootNode);
    
    for (const node of treeNodes) {
        try {
            node.state.classification = classify(node, options);
        } catch (err) {
            console.log(err);
            node.state.classification = undefined;
        }

        node.state.opening = getOpeningName(node.state.fen);

        if (!node.parent) continue;

        const previous = extractPreviousStateTreeNode(node.parent);
        const current = extractCurrentStateTreeNode(node);

        if (!previous || !current) continue;

        node.state.accuracy = getMoveAccuracy(
            previous.evaluation,
            current.evaluation,
            adaptPieceColour(current.playedMove.color)
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