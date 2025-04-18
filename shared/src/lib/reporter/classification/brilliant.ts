import { Chess, QUEEN } from "chess.js";

import { parseUciMove } from "@lib/moveNotation";
import {
    ExtractedPreviousNode,
    ExtractedCurrentNode
} from "../utils/types/ExtractedNode";
import BoardPiece from "../utils/types/BoardPiece";
import { pieceValues } from "@constants/utils";
import { getBoardPieces } from "../utils/boardPieces";
import { getAttackers } from "../utils/attackers";
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
    console.log(`considering brilliant for: ${current.playedMove.san}`);

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

    console.log(`unsafe pieces: ${unsafePieces.map(piece => `${piece.color}${piece.type} on ${piece.square}`)}`);

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

    console.log(`all unsafe pieces protected by danger levels: ${dangerLevelsProtected}`);

    if (dangerLevelsProtected) return false;

    // If moved piece was trapped in previous position, do not allow
    // desperado to be considered brilliant
    const pieceTrapped = getPieceTrapped(previous.board, {
        ...current.playedPiece,
        square: parsedPlayedMove.from
    });

    console.log(`was moved piece trapped before: ${pieceTrapped}`);

    if (pieceTrapped) return false;

    return unsafePieces.length > 0;
}