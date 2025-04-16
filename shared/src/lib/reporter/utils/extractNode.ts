import { Chess } from "chess.js";

import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { getTopEngineLine } from "@ctypes/game/position/BoardState";
import ExtractedNode from "./types/ExtractedNode";
import PieceColour from "@constants/PieceColour";

/**
 * @description Extract analysis information from a node. Returns an object
 * of extracted data, or null if any pieces of data are missing.
 */
export function extractStateTreeNode(
    node: StateTreeNode
): ExtractedNode | null {
    const topLine = getTopEngineLine(node.state);
    if (!topLine) return null;

    const topMove = topLine.moves.at(0);
    if (!topMove) return null;

    const playedMove = node.state.move;
    if (!playedMove) return null;

    const moveColour = node.state.moveColour;
    if (!moveColour) return null;

    const subjectiveEvaluationValue = (
        topLine.evaluation.value
        * (moveColour == PieceColour.WHITE ? 1 : -1)
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
        playedMove: playedMove,
        moveColour: moveColour
    };
}