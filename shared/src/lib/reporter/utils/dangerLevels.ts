import { Chess, Move, ROOK } from "chess.js";

import { BoardPiece } from "../types/BoardPiece";
import { RawMove } from "../types/RawMove";
import { pieceValues } from "@constants/utils";
import { adaptPieceColour, parseSanMove } from "@lib/chessUtils";
import { getUnsafePieces } from "./pieceSafety";
import PieceColour from "@constants/PieceColour";

/**
 * @description Returns a list of pieces of higher or equal value to the
 * threatened piece that are unsafe in this position.
 */
function getRelativeUnsafePieces(
    threatenedPiece: BoardPiece,
    actionBoard: Chess,
    colour: PieceColour,
    playedMove?: Move
) {
    return getUnsafePieces(
        actionBoard, colour, playedMove
    ).filter(piece => (
        piece.square != threatenedPiece.square
        && pieceValues[piece.type] >= pieceValues[threatenedPiece.type]
    ));
}

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

    const previousRelativeUnsafePieces = getRelativeUnsafePieces(
        threatenedPiece,
        actionBoard,
        adaptPieceColour(actingMove.color)
    ).length;

    try {
        var bakedMove = actionBoard.move(actingMove);
    } catch {
        return true;
    }

    // Sacrifice that if taken leads to greater value being lost
    const relativeUnsafePieces = getRelativeUnsafePieces(
        threatenedPiece,
        actionBoard,
        adaptPieceColour(actingMove.color),
        bakedMove
    ).length;

    // Minor piece sacrifice that if taken leads to mate
    const threatenedPieceValue = pieceValues[threatenedPiece.type];

    const lowValueCheckmatePin = threatenedPieceValue < pieceValues[ROOK]
        && actionBoard.moves().some(
            move => parseSanMove(move).checkmate
        );

    return (
        (relativeUnsafePieces > previousRelativeUnsafePieces)
        || lowValueCheckmatePin
    );
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