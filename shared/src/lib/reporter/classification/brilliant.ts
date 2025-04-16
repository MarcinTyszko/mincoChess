import { Square, KING, PAWN } from "chess.js";

import { adaptPieceColour, parseUciMove } from "@lib/moveNotation";
import ExtractedNode from "../utils/types/ExtractedNode";
import { pieceValues } from "@constants/utils";
import { getPieceSafety } from "../utils/pieceSafety";

/**
 * @description Consider brilliant classification based on a
 * state. Returns whether brilliant is recommended
 */
export function considerBrilliantClassification(
    previous: ExtractedNode,
    current: ExtractedNode
) {
    // Disallow brilliants for highly winning positions where
    // critical moves are not needed to move towards checkmate
    if (
        current.evaluation.type == "centipawn"
        && current.subjectiveEvaluation.value >= 700
    ) return false;

    // Disallow brilliants if player is losing
    if (current.subjectiveEvaluation.value < 0) {
        return false;
    }

    // Disallow promotions as brilliants
    const parsedPlayedMove = parseUciMove(current.playedMove.uci);

    if (parsedPlayedMove.promotion) {
        return false;
    }
    
    // Disallow moves that escape check as brilliants
    if (previous.board.isCheck()) {
        return false;
    }

    // Scan current board for hanging pieces
    const capturedPiece = previous.board.get(parsedPlayedMove.to as Square);
    const capturedPieceValue = capturedPiece
        ? pieceValues[capturedPiece.type] : 0;

    const boardPieces = current.board.board()
        .reduce((acc, val) => acc.concat(val))
        .filter(piece => (
            piece?.color == adaptPieceColour(current.moveColour)
            && piece.type != KING
            && piece.type != PAWN
            && pieceValues[piece.type] > capturedPieceValue
        ));

    return boardPieces.some(
        piece => !getPieceSafety(current.board, piece!)
    );
}