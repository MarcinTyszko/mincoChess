import { Chess } from "chess.js";

import BoardPiece from "./types/BoardPiece";
import { flipAdaptedPieceColour } from "@lib/moveNotation";
import { getPieceSafety } from "./pieceSafety";

export function getPieceTrapped(board: Chess, piece: BoardPiece) {
    const pieceSafety = getPieceSafety(board, piece);
    
    const pieceMoves = board.moves({
        square: piece.square,
        verbose: true
    });

    const allMovesUnsafe = pieceMoves.every(move => {
        const escapeBoard = new Chess(board.fen());
        
        const escapeMove = escapeBoard.move(move.lan);

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