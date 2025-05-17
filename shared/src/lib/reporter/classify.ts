import ReportOptions from "./types/ReportOptions";
import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { Classification, classifValues } from "@constants/Classification";
import {
    extractPreviousStateTreeNode,
    extractCurrentStateTreeNode
} from "./utils/extractNode";

import { getOpeningName } from "./utils/opening";
import { pointLossClassify } from "./classification/pointLoss";
import { considerBrilliantClassification } from "./classification/brilliant";
import { considerCriticalClassification } from "./classification/critical";

export function classify(
    node: StateTreeNode,
    options?: ReportOptions
) {
    if (!node.parent) {
        throw new Error("no parent node exists to compare with.");
    }

    const previous = extractPreviousStateTreeNode(node.parent);
    const current = extractCurrentStateTreeNode(node);

    if (!previous || !current) {
        throw new Error("information missing from current or previous node.");
    }

    const opts: Required<ReportOptions> = {
        includeBrilliant: true,
        includeCritical: true,
        includeTheory: true,
        ...options
    };

    // Consider forced classification
    if (previous.board.moves().length <= 1) {
        return Classification.FORCED;
    }

    // Consider theory classification
    const openingName = getOpeningName(current.state.fen);

    if (opts.includeTheory && openingName) {
        return Classification.THEORY;
    }

    const topMovePlayed = previous.topMove.san == current.playedMove.san;

    // Point loss classify
    let classification = topMovePlayed
        ? Classification.BEST
        : pointLossClassify(previous, current);

    // Consider only and brilliant classification
    if (
        opts.includeCritical
        && topMovePlayed
        && considerCriticalClassification(previous, current)
    ) classification = Classification.CRITICAL;

    if (
        opts.includeBrilliant
        && classifValues[classification] >= classifValues[Classification.BEST]
        && considerBrilliantClassification(previous, current)
    ) classification = Classification.BRILLIANT;

    return classification;
}