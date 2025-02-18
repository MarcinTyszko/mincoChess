import { Chess } from "chess.js";

import {
    Game,
    GameResult,
    PieceColour,
    Variant,
    STARTING_FEN
} from "wintrchess";

function parseResultString(result: string, colour: PieceColour) {
    if (result == "1/2-1/2") return GameResult.DRAW;
    if (result == "*") return GameResult.UNKNOWN;

    const winningResult = colour == PieceColour.WHITE ? "1-0" : "0-1";

    return result == winningResult ? GameResult.WIN : GameResult.LOSE;
}

function parsePgn(pgn: string): Game {
    const parsedGame = new Chess();
    parsedGame.loadPgn(pgn);

    const parsedGameHeaders = parsedGame.getHeaders();

    const parsedGameVariant = (
        parsedGameHeaders["Variant"] == "Chess960"
            ? Variant.CHESS960
            : Variant.STANDARD
    );

    let initialPosition = parsedGameHeaders["FEN"] || STARTING_FEN;

    try {
        new Chess(initialPosition);
    } catch {
        initialPosition = STARTING_FEN;
    }

    return {
        pgn: pgn,
        players: {
            white: {
                username: parsedGameHeaders["White"] || "White",
                title: parsedGameHeaders["WhiteTitle"],
                rating: parseInt(parsedGameHeaders["WhiteElo"]),
                image: parsedGameHeaders["WhiteUrl"],
                result: parseResultString(
                    parsedGameHeaders["Result"],
                    PieceColour.WHITE
                )
            },
            black: {
                username: parsedGameHeaders["Black"] || "Black",
                title: parsedGameHeaders["BlackTitle"],
                rating: parseInt(parsedGameHeaders["BlackElo"]),
                image: parsedGameHeaders["BlackUrl"],
                result: parseResultString(
                    parsedGameHeaders["Result"],
                    PieceColour.BLACK
                )
            }
        },
        variant: parsedGameVariant,
        initialPosition: initialPosition
    };
}

export default parsePgn;