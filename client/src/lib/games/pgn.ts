import { parse } from "pgn-parser";

import { Game } from "wintrchess";

function parsePgn(pgn: string) {
    const parsedPgn = parse(pgn)[0];

    // const game: Game = {
    //     pgn: pgn,
    //     players: {
            
    //     }
    // }; 
}

export default parsePgn;