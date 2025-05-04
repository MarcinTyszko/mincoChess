import { Chess, ROOK } from "chess.js";

import { BoardPiece, getBoardPieces } from "../types/BoardPiece";
import { RawMove } from "../types/RawMove";
import { pieceValues } from "@constants/utils";
import { parseSanMove } from "@lib/notation";
import { isPieceSafe } from "./pieceSafety";

/**
 * @description Assuming that a given piece is under threat, act on the threat
 * through a given move. For example, capturing it as the opponent, or moving
 * it to safety. Returns whether playing the move creates a greater
 * counterthreat than that already imposed on the threatened piece.
 */
export function moveCreatesGreaterThreat(
    board: Chess,
    threatenedPiece: BoardPiece,
    actingMove: RawMove
) {
    const actionBoard = new Chess(board.fen());

    try {
        var bakedMove = actionBoard.move(actingMove);
    } catch {
        return true;
    }

    // Sacrifice that if taken leads to greater value being lost
    const relativeMaterialPin = getBoardPieces(actionBoard)
        .filter(piece => piece.color == actingMove.color)
        .some(piece => (
            pieceValues[piece.type] >= pieceValues[threatenedPiece.type]
            && !isPieceSafe(actionBoard, piece, bakedMove)
        ));

    // Minor piece sacrifice that if taken leads to mate
    const threatenedPieceValue = pieceValues[threatenedPiece.type];

    const lowValueCheckmatePin = threatenedPieceValue < pieceValues[ROOK]
        && actionBoard.moves().some(
            move => parseSanMove(move).checkmate
        );

    return relativeMaterialPin || lowValueCheckmatePin;
}

/**
 * @description Returns whether all acting moves create a threat larger than
 * that imposed on the threatened piece.
 */
export function hasDangerLevels(
    board: Chess,
    threatenedPiece: BoardPiece,
    actingMoves: RawMove[]
) {
    return actingMoves.every(actingMove => (
        moveCreatesGreaterThreat(board, threatenedPiece, actingMove)
    ));
}