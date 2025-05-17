import { Chess, Move, ROOK } from "chess.js";
import { isEqual } from "lodash";

import { BoardPiece } from "../types/BoardPiece";
import { RawMove } from "../types/RawMove";
import { pieceValues } from "@constants/utils";
import PieceColour from "@constants/PieceColour";
import { adaptPieceColour, parseSanMove } from "@lib/chessUtils";
import { getUnsafePieces } from "./pieceSafety";
import { getAttackingMoves } from "./attackers";

/**
 * @description Returns a list of attacking moves of unsafe pieces of a
 * given colour that are higher or equal in value to the threatened piece.
 */
function relativeUnsafePieceAttacks(
    actionBoard: Chess,
    threatenedPiece: BoardPiece,
    colour: PieceColour,
    playedMove?: Move
) {
    return getUnsafePieces(actionBoard, colour, playedMove)
        .filter(unsafePiece => (
            unsafePiece.square != threatenedPiece.square
            && pieceValues[unsafePiece.type] >= pieceValues[threatenedPiece.type]
        ))
        .map(unsafePiece => (
            getAttackingMoves(actionBoard, unsafePiece, false)
        ))
        .reduce((acc, val) => acc.concat(val), []);
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

    // Pieces of the acting colour, >= in value to the threatened piece
    // that are already unsafe even before the acting move is played
    const previousRelativeAttacks = relativeUnsafePieceAttacks(
        actionBoard,
        threatenedPiece,
        adaptPieceColour(actingMove.color)
    );

    try {
        var bakedMove = actionBoard.move(actingMove);
    } catch {
        return true;
    }

    // Attacks on unsafe pieces >= in value to threatened piece that
    // now exist after the acting move has been played
    const newRelativeAttacks = relativeUnsafePieceAttacks(
        actionBoard,
        threatenedPiece,
        adaptPieceColour(actingMove.color),
        bakedMove
    ).filter(attack => (
        !previousRelativeAttacks.some(
            previousAttack => isEqual(previousAttack, attack)
        )
    ));

    if (newRelativeAttacks.length > 0) return true;

    // Minor piece sacrifice that if taken leads to mate
    const lowValueCheckmatePin = (
        pieceValues[threatenedPiece.type] < pieceValues[ROOK]
        && actionBoard.moves().some(
            move => parseSanMove(move).checkmate
        )
    );

    return lowValueCheckmatePin;
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