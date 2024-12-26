import { Chess } from "chess.js";

import { Game, Variant } from "wintrchess";

function parseFenString(fen: string): Game {
    const board = new Chess(fen);

    return {
        initialPosition: board.fen(),
        pgn: board.pgn(),
        players: {
            white: {},
            black: {}
        },
        variant: Variant.STANDARD
    };
}

export default parseFenString;