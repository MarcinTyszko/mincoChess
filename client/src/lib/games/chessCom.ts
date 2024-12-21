import { Game, TimeControl, Variant } from "wintrchess";
import { padDateNumber } from "@lib/utils/date";
import { UserNotFoundError } from "../errors";

// Map from chess.com time controls to ours
const timeControlCodes: { [key: string]: TimeControl } = {
    bullet: TimeControl.BULLET,
    blitz: TimeControl.BLITZ,
    rapid: TimeControl.RAPID,
    daily: TimeControl.CORRESPONDENCE
};

// Map from chess.com variants to ours
const variantCodes: { [key: string]: Variant } = {
    chess: Variant.STANDARD,
    chess960: Variant.CHESS960
};

async function getChessComGames(
    username: string,
    month: number,
    year: number
): Promise<Game[]> {
    const gamesResponse = await fetch(
        `https://api.chess.com/pub/player/${username}`
        + `/games/${year}/${padDateNumber(month + 1)}`
    );

    if (gamesResponse.status == 404) {
        throw new UserNotFoundError(
            "pages.analysis.gameSearchMenu.userNotFound"
        );
    }

    const games = (await gamesResponse.json()).games as any[];
    
    if (!games) {
        return [];
    }

    return games.map(game => ({
        pgn: game.pgn,
        timeControl: (
            timeControlCodes[game["time_class"]]
            || TimeControl.CORRESPONDENCE
        ),
        variant: variantCodes[game.rules] || Variant.STANDARD,
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
        date: new Date(game["end_time"] * 1000)
    }));
}

export default getChessComGames;