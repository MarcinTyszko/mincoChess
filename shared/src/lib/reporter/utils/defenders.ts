import { Chess } from "chess.js";

import BoardPiece from "./types/BoardPiece";
import { flipAdaptedPieceColour } from "@lib/moveNotation";
import { getAttackers } from "./attackers";

export function getDefenders(
    board: Chess,
    piece: BoardPiece,
    transitive: boolean = true
) {
    const defenderBoard = new Chess(board.fen());

    defenderBoard.put({
        type: piece.type,
        color: flipAdaptedPieceColour(piece.color)
    }, piece.square);

    return getAttackers(defenderBoard, piece, transitive);
}