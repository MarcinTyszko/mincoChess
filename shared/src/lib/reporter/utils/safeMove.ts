import { Chess } from "chess.js";

import RawMove from "../types/RawMove";

export function safeMove(fen: string, move: string | RawMove) {
    try {
        return new Chess(fen).move(move);
    } catch {
        return undefined;
    }
}