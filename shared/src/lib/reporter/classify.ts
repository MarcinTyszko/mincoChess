import { getTopEngineLine } from "@ctypes/game/position/BoardState";
import { getNodeChain, StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { pointLossClassify } from "./classification/pointLoss";

export function classify(node: StateTreeNode) {
    if (!node.parent || !node.state.moveColour) {
        throw new Error("no parent node exists to compare with.");
    }

    const currentTopLine = getTopEngineLine(node.state);
    const previousTopLine = getTopEngineLine(node.parent.state);

    if (!currentTopLine || !previousTopLine) {
        throw new Error("engine lines missing from node or its parent.");
    }

    return pointLossClassify(
        previousTopLine.evaluation,
        currentTopLine.evaluation,
        node.state.moveColour
    );
}

export function classifyTree(rootNode: StateTreeNode) {
    const treeNodes = getNodeChain(rootNode, true);

    for (const node of treeNodes) {
        try {
            node.state.classification = classify(node);
        } catch {
            node.state.classification = undefined;
        }
    }
}