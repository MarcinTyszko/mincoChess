import { Chess } from "chess.js";

import BoardPiece from "./types/BoardPiece";
import { flipAdaptedPieceColour } from "@lib/moveNotation";
import { getPieceSafety } from "./pieceSafety";

export function getPieceTrapped(board: Chess, piece: BoardPiece) {
    const pieceSafety = getPieceSafety(board, piece);
    const pieceMoves = board.moves({ square: piece.square });

    const allMovesUnsafe = pieceMoves.every(moveSan => {
        const escapeBoard = new Chess(board.fen());
        
        const escapeMove = escapeBoard.move(moveSan);

        return !getPieceSafety(
            escapeBoard,
            { ...piece, square: escapeMove.to },
            escapeMove.captured
                ? {
                    color: flipAdaptedPieceColour(piece.color),
                    type: escapeMove.captured,
                    square: escapeMove.to
                }
                : undefined
        );
    });

    return !pieceSafety && allMovesUnsafe;
}