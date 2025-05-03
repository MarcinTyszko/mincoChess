import { Chess } from "chess.js";

import { RawMove } from "../types/RawMove";

type PieceMovement = Pick<RawMove, "from" | "to" | "promotion">;

export function safeMove(fen: string, move: string | PieceMovement) {
    try {
        return new Chess(fen).move(move);
    } catch {
        return undefined;
    }
}