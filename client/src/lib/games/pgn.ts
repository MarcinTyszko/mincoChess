import { Chess } from "chess.js";

import {
    Game,
    GameResult,
    PieceColour,
    Variant
} from "wintrchess";

function parseResultString(result: string, colour: PieceColour) {
    if (result == "1/2-1/2" || result == "*") {
        return GameResult.AGREED;
    }

    const winningResult = colour == PieceColour.WHITE ? "1-0" : "0-1";

    return result == winningResult ? GameResult.WIN : GameResult.LOSE;
}

function parsePgn(pgn: string): Game {
    const parsedGame = new Chess();
    parsedGame.loadPgn(pgn);

    const parsedGameHeaders = parsedGame.header();

    const parsedGameVariant = (
        parsedGameHeaders["Variant"] == "Chess960"
            ? Variant.CHESS960
            : Variant.STANDARD
    );

    return {
        pgn: pgn,
        players: {
            white: {
                username: parsedGameHeaders["White"],
                title: parsedGameHeaders["WhiteTitle"],
                rating: parseInt(parsedGameHeaders["WhiteElo"]),
                result: parseResultString(
                    parsedGameHeaders["Result"],
                    PieceColour.WHITE
                )
            },
            black: {
                username: parsedGameHeaders["Black"],
                title: parsedGameHeaders["BlackTitle"],
                rating: parseInt(parsedGameHeaders["BlackElo"]),
                result: parseResultString(
                    parsedGameHeaders["Result"],
                    PieceColour.BLACK
                )
            }
        },
        variant: parsedGameVariant,
        initialPosition: parsedGameHeaders["FEN"] || new Chess().fen()
    };
}

export default parsePgn;