import { getNodeChain, StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { getTopEngineLine } from "@ctypes/game/position/BoardState";
import Classification from "@constants/Classification";
import { pointLossClassify } from "./classification/pointLoss";
import { considerBrilliantClassification } from "./classification/brilliant";

interface ClassifyOptions {
    includeBrilliant?: boolean;
    includeTheory?: boolean;
}

export function classify(
    node: StateTreeNode,
    options?: ClassifyOptions
) {
    if (!node.parent || !node.state.moveColour) {
        throw new Error("no parent node exists to compare with.");
    }

    const previousTopLine = getTopEngineLine(node.parent.state);
    const currentTopLine = getTopEngineLine(node.state);

    if (!previousTopLine?.evaluation || !currentTopLine?.evaluation) {
        throw new Error("engine lines missing from current or previous node.");
    }

    const opts: ClassifyOptions = {
        includeBrilliant: true,
        includeTheory: true,
        ...options
    };

    let classification = pointLossClassify(
        previousTopLine.evaluation,
        currentTopLine.evaluation,
        node.state.moveColour
    );

    if (
        classification == Classification.BEST
        && opts.includeBrilliant
        && considerBrilliantClassification(node.parent.state, node.state)
    ) {
        classification = Classification.BRILLIANT;
    }

    return classification;
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