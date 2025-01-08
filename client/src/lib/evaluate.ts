import { Chess } from "chess.js";

import { Game, BoardState } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";
import Engine from "./engine";

interface EvaluateMovesOptions {
    engineVersion: EngineVersion;
    maxEngineCount?: number;
    engineDepth: number;
    engineConfigFunc?: (engine: Engine) => void;
}

function evaluateMoves(
    game: Game,
    options: EvaluateMovesOptions
): Promise<BoardState[]> {
    // Get moves from the game
    const board = new Chess();
    board.loadPgn(game.pgn);

    const moves = board.history({ verbose: true });

    const maxEngineCount = options.maxEngineCount || 1;

    return new Promise(res => {
        const boardStates: BoardState[] = [];

        let enginesResting = 0;
        let boardStateIndex = 0;

        // Bring an engine to a new FEN
        function evaluateNextPosition(engine: Engine) {
            if (boardStateIndex > moves.length) {
                if (++enginesResting == maxEngineCount) {
                    res(boardStates);
                }

                return;
            }

            engine.setPosition(
                game.initialPosition,
                moves
                    .map(move => move.lan)
                    .slice(0, boardStateIndex)
            );

            const currentBoardStateIndex = boardStateIndex;

            engine.evaluate(options.engineDepth).then(result => {
                boardStates[currentBoardStateIndex] = {
                    engineLines: {
                        local: result.lines
                    },
                    move: currentBoardStateIndex > 0
                        ? {
                            san: moves[currentBoardStateIndex - 1].san,
                            uci: moves[currentBoardStateIndex - 1].lan
                        }
                        : undefined
                };

                evaluateNextPosition(engine);
            });

            boardStateIndex++;
        }

        // Start engines on first positions
        for (let i = 0; i < maxEngineCount; i++) {
            const engine = new Engine(options.engineVersion);
            options.engineConfigFunc?.(engine);

            evaluateNextPosition(engine);
        }
    });
}

export default evaluateMoves;