import { Chess } from "chess.js";

import { Game, BoardState } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";

function evaluateMoves(
    game: Game,
    engineVersion: EngineVersion
): BoardState[] {
    // Get moves from the game
    const board = new Chess();
    board.loadPgn(game.pgn);

    const fens: string[] = [game.initialPosition];
    const fenCollectionBoard = new Chess(game.initialPosition);

    // Collect FENs at each position of the game
    for (const sanMove of board.moves()) {
        fenCollectionBoard.move(sanMove);
        fens.push(fenCollectionBoard.fen());
    }

    const positions = [];

    while (positions.length != fens.length) {
        
    }

    return [];
}

export default evaluateMoves;