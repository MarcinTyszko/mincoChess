import { Chess } from "chess.js";

import { Game, GameResult, Variant } from "wintrchess";

function parseFenString(fen: string): Game {
    const board = new Chess(fen);

    return {
        initialPosition: board.fen(),
        pgn: board.pgn(),
        players: {
            white: {
                result: GameResult.UNKNOWN
            },
            black: {
                result: GameResult.UNKNOWN
            }
        },
        variant: Variant.STANDARD
    };
}

export default parseFenString;