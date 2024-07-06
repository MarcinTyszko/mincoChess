import { Game } from "wintrchess";
import { padDateNumber } from "@lib/utils/date";
import { UserNotFoundError } from "./errors";

async function getChessComGames(
    username: string,
    month: number,
    year: number
): Promise<Game[]> {
    const gamesResponse = await fetch(
        `https://api.chess.com/pub/player/${username}/games/${year}/${padDateNumber(month + 1)}`
    );

    if (gamesResponse.status == 404) {
        throw new UserNotFoundError(
            "pages.analysis.gameSearchMenu.userNotFound"
        );
    }

    const games = (await gamesResponse.json()).games as any[];
    if (!games) return [];

    return games.map(game => ({
        pgn: game.pgn,
        timeControl: game["time_class"],
        variant: game.rules,
        initialPosition: game["initial_setup"],
        players: {
            white: {
                username: game.white.username,
                rating: game.white.rating,
                result: game.white.result
            },
            black: {
                username: game.black.username,
                rating: game.black.rating,
                result: game.black.result
            }
        },
        date: new Date(game["end_time"])
    }));
}

export default getChessComGames;