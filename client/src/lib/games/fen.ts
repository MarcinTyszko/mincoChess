import { Chess } from "chess.js";

import { Game, GameResult, Variant } from "wintrchess";

function parseFenString(fen: string): Game {
    const board = new Chess(fen);

    return {
        initialPosition: fen,
        pgn: board.pgn(),
        players: {
            white: {
                result: GameResult.AGREED
            },
            black: {
                result: GameResult.AGREED
            }
        },
        variant: Variant.STANDARD
    };
}

export default parseFenString;