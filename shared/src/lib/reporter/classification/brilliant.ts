import {
    ExtractedPreviousNode,
    ExtractedCurrentNode
} from "../types/ExtractedNode";
import { adaptPieceColour } from "@lib/notation";
import { getUnsafePieces } from "../utils/pieceSafety";
import { hasDangerLevels } from "../utils/dangerLevels";
import { isPieceTrapped } from "../utils/pieceTrapped";
import { getAttackingMoves } from "../utils/attackers";

/**
 * @description Consider brilliant classification based on a
 * state. Returns whether brilliant is recommended
 */
export function considerBrilliantClassification(
    previous: ExtractedPreviousNode,
    current: ExtractedCurrentNode
) {
    // Disallow brilliants for highly winning positions where
    // critical moves are not needed to move towards checkmate
    if (
        current.evaluation.type == "centipawn"
        && current.subjectiveEvaluation.value >= 700
    ) return false;

    // Disallow brilliants in losing positions
    if (current.subjectiveEvaluation.value < 0) {
        return false;
    }

    // Disallow promotions as brilliants
    if (current.playedMove.promotion) {
        return false;
    }
    
    // Disallow moves that escape check as brilliants
    if (previous.board.isCheck()) {
        return false;
    }

    // Scan current board for unsafe pieces
    const unsafePieces = getUnsafePieces(
        current.board,
        adaptPieceColour(current.playedMove.color),
        current.playedMove
    );

    // Moving a piece to safety (less unsafe pieces than in previous position)
    // disallows a brilliant
    const previousUnsafePieces = getUnsafePieces(
        previous.board,
        adaptPieceColour(current.playedMove.color)
    );

    if (unsafePieces.length < previousUnsafePieces.length) {
        return false;
    }

    // Detect equal or greater counterthreats when unsafe piece is taken
    const dangerLevelsProtected = unsafePieces.every(unsafePiece => (
        hasDangerLevels(
            current.board,
            unsafePiece,
            getAttackingMoves(current.board, unsafePiece, false)
        )
    ));

    if (dangerLevelsProtected) return false;

    // If all unsafe pieces are trapped or if the moved one was previously
    // trapped, do not allow brilliant
    const allUnsafePiecesTrapped = unsafePieces.every(
        unsafePiece => isPieceTrapped(current.board, unsafePiece)
    );

    const movedPieceTrapped = isPieceTrapped(previous.board, {
        type: current.playedMove.piece,
        color: current.playedMove.color,
        square: current.playedMove.from
    });

    if (allUnsafePiecesTrapped || movedPieceTrapped) return false;

    return unsafePieces.length > 0;
}