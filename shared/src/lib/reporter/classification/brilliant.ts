import { Chess, QUEEN } from "chess.js";

import {
    ExtractedPreviousNode,
    ExtractedCurrentNode
} from "../types/ExtractedNode";
import { getBoardPieces, toBoardPiece } from "../types/BoardPiece";
import { pieceValues } from "@constants/utils";
import { adaptPieceColour } from "@lib/notation";
import { getAttackingMoves } from "../utils/attackers";
import { getPieceSafety, getUnsafePieces } from "../utils/pieceSafety";
import { getPieceTrapped } from "../utils/pieceTrapped";

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

    // Detect equal or greater counterthreats (danger levels) or relative pins
    const dangerLevelsProtected = unsafePieces.every(unsafePiece => {
        const attackers = getAttackingMoves(current.board, unsafePiece, false)
            .map(toBoardPiece);

        // Check if every attacker's capture would leave one of their side's
        // pieces of greater or equal value unsafe.
        return attackers.every(attacker => {
            const captureBoard = new Chess(current.state.fen);

            try {
                captureBoard.move({
                    from: attacker.square,
                    to: unsafePiece.square,
                    promotion: QUEEN
                });
            } catch {
                return true;
            }

            return getBoardPieces(captureBoard)
                .filter(piece => piece.color == attacker.color)
                .some(piece => (
                    pieceValues[piece.type] >= pieceValues[unsafePiece.type]
                    && !getPieceSafety(captureBoard, piece, current.playedMove)
                ));
        });
    });

    if (dangerLevelsProtected) return false;

    // If moved piece was trapped in previous position, do not allow
    // desperado to be considered brilliant
    const pieceTrapped = getPieceTrapped(previous.board, {
        type: current.playedMove.piece,
        color: current.playedMove.color,
        square: current.playedMove.from
    });

    if (pieceTrapped) return false;

    return unsafePieces.length > 0;
}