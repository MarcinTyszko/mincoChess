import { Chess } from "chess.js";
import { isEqual } from "lodash";

import BoardPiece from "./types/BoardPiece";

export function getAttackers(board: Chess, piece: BoardPiece) {
    board.attackers(piece.square);
}