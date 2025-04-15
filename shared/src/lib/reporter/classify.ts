import { getNodeChain, StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { pointLossClassify } from "./classification/pointLoss";
import Classification from "@constants/Classification";
import { considerBrilliantClassification } from "./classification/brilliant";
import { getTopEngineLine } from "@ctypes/game/position/BoardState";

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

    const previousEvaluation = getTopEngineLine(node.parent.state)?.evaluation;
    const currentEvaluation = getTopEngineLine(node.state)?.evaluation;

    if (!previousEvaluation || !currentEvaluation) {
        throw new Error("engine lines missing from current or previous node.");
    }

    const opts: ClassifyOptions = {
        includeBrilliant: true,
        includeTheory: true,
        ...options
    };

    let classification = pointLossClassify(
        previousEvaluation,
        currentEvaluation,
        node.state.moveColour
    );

    if (
        classification == Classification.BEST
        && opts.includeBrilliant
        && considerBrilliantClassification(node.parent.state, node.state, 1)
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