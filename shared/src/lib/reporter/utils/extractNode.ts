import { Chess, WHITE } from "chess.js";

import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { getTopEngineLine } from "@ctypes/game/position/BoardState";
import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "../types/ExtractedNode";
import { safeMove } from "./safeMove";

export function extractPreviousStateTreeNode(
    node: StateTreeNode
): ExtractedPreviousNode | null {
    // Get top engine line and move in this position
    const topLine = getTopEngineLine(node.state);
    if (!topLine) return null;

    const topMoveSan = topLine.moves.at(0)?.san;
    if (!topMoveSan) return null;

    const topMove = safeMove(node.state.fen, topMoveSan);
    if (!topMove) return null;

    // Get played move in this position
    const playedMove = node.parent
        && node.state.move
        && safeMove(node.parent.state.fen, node.state.move.san);

    const subjectiveEvaluationValue = (
        topLine.evaluation.value
        * (playedMove?.color == WHITE ? 1 : -1)
    );

    return {
        board: new Chess(node.state.fen),
        state: node.state,
        topLine: topLine,
        topMove: topMove,
        evaluation: topLine.evaluation,
        subjectiveEvaluation: playedMove?.color
            ? {
                type: topLine.evaluation.type,
                value: subjectiveEvaluationValue
            }
            : undefined,
        playedMove: playedMove
    };
}

/**
 * @description Extract analysis information from a node. Returns an object
 * of extracted data, or null if any required pieces of data are missing.
 */
export function extractCurrentStateTreeNode(
    node: StateTreeNode
): ExtractedCurrentNode | null {
    if (!node.parent) return null;

    // Get top engine line and move in this position
    const topLine = getTopEngineLine(node.state);
    if (!topLine) return null;

    const topMoveSan = topLine.moves.at(0)?.san;
    if (!topMoveSan) return null;

    const topMove = safeMove(node.state.fen, topMoveSan);

    // Get played move in this position
    const playedMoveSan = node.state.move?.san;
    if (!playedMoveSan) return null;

    const playedMove = safeMove(node.parent.state.fen, playedMoveSan);
    if (!playedMove) return null;

    // Get subjective evaluation
    const subjectiveEvaluationValue = (
        topLine.evaluation.value
        * (playedMove.color == WHITE ? 1 : -1)
    );

    return {
        board: new Chess(node.state.fen),
        state: node.state,
        topLine: topLine,
        topMove: topMove,
        evaluation: topLine.evaluation,
        subjectiveEvaluation: {
            type: topLine.evaluation.type,
            value: subjectiveEvaluationValue
        },
        playedMove: playedMove
    };
}