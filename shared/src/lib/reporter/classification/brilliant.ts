import { Chess, QUEEN } from "chess.js";

import { parseUciMove } from "@lib/moveNotation";
import {
    ExtractedPreviousNode,
    ExtractedCurrentNode
} from "../utils/types/ExtractedNode";
import { pieceValues } from "@constants/utils";
import { getBoardPieces } from "../utils/boardPieces";
import { getPieceSafety, getUnsafePieces } from "../utils/pieceSafety";
import { getAttackers } from "../utils/attackers";
import BoardPiece from "../utils/types/BoardPiece";

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

    // Disallow promotions as brilliants
    const parsedPlayedMove = parseUciMove(current.playedMove.uci);

    if (parsedPlayedMove.promotion) {
        return false;
    }
    
    // Disallow moves that escape check as brilliants
    if (previous.board.isCheck()) {
        return false;
    }

    // Scan current board for unsafe pieces
    const capturedPiece = previous.board.get(parsedPlayedMove.to);

    const capturedBoardPiece: BoardPiece | undefined = capturedPiece
        ? { ...capturedPiece, square: parsedPlayedMove.to }
        : undefined;

    const unsafePieces = getUnsafePieces(
        current.board,
        current.moveColour,
        capturedBoardPiece
    );

    // Moving a piece to safety (less unsafe pieces than in previous position)
    // disallows a brilliant
    const previousUnsafePieces = getUnsafePieces(
        previous.board,
        current.moveColour
    );

    if (unsafePieces.length < previousUnsafePieces.length) {
        return false;
    }

    // Detect equal or greater counterthreats (danger levels) or relative pins
    const dangerLevelsProtected = unsafePieces.every(unsafePiece => {
        const attackers = getAttackers(current.board, unsafePiece, false);

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
                    && !getPieceSafety(captureBoard, piece, capturedBoardPiece)
                ));
        });
    });

    if (dangerLevelsProtected) return false;

    return unsafePieces.length > 0;
}