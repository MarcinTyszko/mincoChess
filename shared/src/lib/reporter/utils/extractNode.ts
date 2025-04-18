import { Chess } from "chess.js";

import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { getTopEngineLine } from "@ctypes/game/position/BoardState";
import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "./types/ExtractedNode";
import PieceColour from "@constants/PieceColour";
import { parseUciMove } from "@lib/moveNotation";
import BoardPiece from "./types/BoardPiece";

export function extractPreviousStateTreeNode(
    node: StateTreeNode
): ExtractedPreviousNode | null {
    const topLine = getTopEngineLine(node.state);
    if (!topLine) return null;

    const topMove = topLine.moves.at(0);
    if (!topMove) return null;

    const playedMove = node.state.move;
    const moveColour = node.state.moveColour;

    let playedPiece: BoardPiece | undefined;

    if (playedMove) {
        const parsedPlayedMove = parseUciMove(playedMove.uci);
        const piece = new Chess(node.state.fen).get(parsedPlayedMove.to);

        playedPiece = piece
            ? { ...piece, square: parsedPlayedMove.to }
            : undefined;
    }

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
        subjectiveEvaluation: moveColour
            ? {
                type: topLine.evaluation.type,
                value: subjectiveEvaluationValue
            }
            : undefined,
        playedMove: playedMove,
        moveColour: moveColour,
        playedPiece: playedPiece
    };
}

/**
 * @description Extract analysis information from a node. Returns an object
 * of extracted data, or null if any required pieces of data are missing.
 */
export function extractCurrentStateTreeNode(
    node: StateTreeNode
): ExtractedCurrentNode | null {
    const topLine = getTopEngineLine(node.state);
    if (!topLine) return null;

    const topMove = topLine.moves.at(0);

    const playedMove = node.state.move;
    if (!playedMove) return null;

    const moveColour = node.state.moveColour;
    if (!moveColour) return null;

    const parsedPlayedMove = parseUciMove(playedMove.uci);
    const piece = new Chess(node.state.fen).get(parsedPlayedMove.to);
    if (!piece) return null;

    const playedPiece: BoardPiece = {
        ...piece,
        square: parsedPlayedMove.to
    };

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
        moveColour: moveColour,
        playedPiece: playedPiece
    };
}