import { Chess, Move } from "chess.js";

import { Game, BoardState, EngineLine } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";
import Engine from "./engine";
import { EvaluateMovesError } from "./errors";

interface EvaluateMovesOptions {
    engineVersion: EngineVersion;
    maxEngineCount?: number;
    engineDepth: number;
    engineConfig?: (engine: Engine) => void;
    onProgress?: (progress: number) => void;
    verbose?: boolean;
}

const UCI_CASTLING_MOVES: Record<string, string> = {
    e8h8: "e8g8",
    e1h1: "e1g1",
    e8a8: "e8c8",
    e1a1: "e1c1"
};

async function evaluateMoves(
    game: Game,
    options: EvaluateMovesOptions
): Promise<BoardState[]> {
    const boardStates: BoardState[] = [];

    // Get moves from the game, include null move for starting position
    const board = new Chess();
    board.loadPgn(game.pgn);

    const moves: (Move | null)[] = board.history({ verbose: true });
    moves.unshift(null);

    // Apply cloud evaluations where possible
    const fenCollectionBoard = new Chess(game.initialPosition);
    
    for (const move of moves) {
        // Add move to temp board to collect current FEN
        if (move) {
            fenCollectionBoard.move(move.lan);
        }

        const fen = fenCollectionBoard.fen();

        // Fetch cloud evaluation from Lichess servers
        const cloudEvaluationResponse = await fetch(
            "https://lichess.org/api/cloud-eval"
                + `?fen=${fen}`
                + "&multiPv=2",
            { method: "GET" }
        );

        if (options.verbose) {
            console.log(`sending cloud evaluation request for: ${fen}`);
        }

        // If no evaluations or found / other error, skip to local
        if (!cloudEvaluationResponse.ok) {
            break; 
        }

        const cloudEvaluation = await cloudEvaluationResponse.json();

        // Depth must be at least as configured by user
        if (cloudEvaluation.depth < options.engineDepth) {
            break;
        }

        const engineLines: EngineLine[] = [];

        // Parse each variation as our engine lines
        for (const variation of cloudEvaluation.pvs) {
            const variationBoard = new Chess(fen);

            engineLines.push({
                evaluation: {
                    type: variation.cp ? "centipawn" : "mate",
                    value: parseFloat(variation.cp || variation.mate)
                },
                depth: parseInt(cloudEvaluation.depth),
                index: parseInt(cloudEvaluation.pvs.indexOf(variation)),
                moves: variation.moves
                    .split(" ")
                    .map((uciMove: string) => {
                        if (Object.keys(UCI_CASTLING_MOVES).includes(uciMove)) {
                            uciMove = UCI_CASTLING_MOVES[uciMove];
                        }

                        variationBoard.move(uciMove);

                        const parsedMove = variationBoard
                            .history({ verbose: true })
                            .at(-1);

                        if (!parsedMove) {
                            throw new EvaluateMovesError(
                                "error with temp board for loading cloud variations."
                            );
                        }

                        return {
                            san: parsedMove.san,
                            uci: parsedMove.lan
                        };
                    })
            });
        }

        boardStates.push({
            engineLines: {
                cloud: engineLines
            },
            move: move
                ? {
                    san: move.san,
                    uci: move.lan
                }
                : undefined
        });
    }

    // Locally evaluate remaining positions

    // Maximum engine count or however many are needed for each
    // remaining position, add 1 for cutoff for last cloud evaluated state
    const requiredEngineCount = Math.min(
        options.maxEngineCount || 1,
        (moves.length - boardStates.length) + 1
    );

    return new Promise((res, rej) => {
        let enginesResting = 0;
        let boardStateIndex = Math.max(boardStates.length - 1, 0);

        // Bring an engine to a new FEN
        function evaluateNextPosition(engine: Engine) {
            if (boardStateIndex >= moves.length) {
                if (++enginesResting == requiredEngineCount) {
                    res(boardStates);
                }

                return;
            }

            engine.setPosition(
                game.initialPosition,
                moves
                    .slice(0, boardStateIndex + 1)
                    .filter(move => !!move)
                    .map(move => move.lan)
            );

            const currentBoardStateIndex = boardStateIndex;
            const currentMove = moves[boardStateIndex];

            engine.evaluate(options.engineDepth).then(result => {
                boardStates[currentBoardStateIndex] ??= {
                    engineLines: {
                        local: result.lines
                    },
                    move: currentMove
                        ? {
                            san: currentMove.san,
                            uci: currentMove.lan
                        }
                        : undefined
                };

                boardStates[currentBoardStateIndex].engineLines.local = result.lines;

                evaluateNextPosition(engine);
            });

            boardStateIndex++;
        }

        // Start engines on first positions
        for (let i = 0; i < requiredEngineCount; i++) {
            const engine = new Engine(options.engineVersion);
            
            options.engineConfig?.(engine);

            if (options.verbose) {
                engine.onMessage(console.log);
            }

            engine.onError(() => rej(
                new EvaluateMovesError("engine failed to evaluate position.")
            ));

            evaluateNextPosition(engine);
        }
    });
}

export default evaluateMoves;