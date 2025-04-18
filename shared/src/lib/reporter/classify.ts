import { getNodeChain, StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import Classification from "@constants/Classification";
import {
    extractPreviousStateTreeNode,
    extractCurrentStateTreeNode
} from "./utils/extractNode";
import { pointLossClassify } from "./classification/pointLoss";
import { considerBrilliantClassification } from "./classification/brilliant";

import openings from "@resources/openings.json";

interface ClassifyOptions {
    includeBrilliant?: boolean;
    includeTheory?: boolean;
}

export function classify(
    node: StateTreeNode,
    options?: ClassifyOptions
) {
    if (!node.parent) {
        throw new Error("no parent node exists to compare with.");
    }

    const previous = extractPreviousStateTreeNode(node.parent);
    const current = extractCurrentStateTreeNode(node);

    if (!previous || !current) {
        throw new Error("information missing from current or previous node.");
    }

    const opts: ClassifyOptions = {
        includeBrilliant: true,
        includeTheory: true,
        ...options
    };

    // Consider forced classification
    if (previous.board.moves().length <= 1) {
        return Classification.FORCED;
    }

    // Consider theory classification
    const openingName = (openings as any)[
        node.state.fen.split(" ")[0]
    ];

    if (opts.includeTheory && openingName) {
        node.state.opening = openingName;

        return Classification.THEORY;
    }

    // Point loss classify
    let classification = previous.topMove.san == current.playedMove.san
        ? Classification.BEST
        : pointLossClassify(previous, current);

    // Consider brilliant classification
    if (
        classification == Classification.BEST
        && opts.includeBrilliant
        && considerBrilliantClassification(previous, current)
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
        } catch (err) {
            console.log(err);

            node.state.classification = undefined;
        }
    }
}