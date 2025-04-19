import { Chess } from "chess.js";

import BoardPiece from "../types/BoardPiece";

export function getBoardPieces(board: Chess): BoardPiece[] {
    return board
        .board()
        .reduce((acc, val) => acc.concat(val))
        .filter(piece => !!piece);
}