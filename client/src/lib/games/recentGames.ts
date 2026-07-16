import { StatusCodes } from "http-status-codes";

import Game from "shared/types/game/Game";
import getChessComGames from "@/lib/games/chessCom";
import getLichessGames from "@/lib/games/lichess";

export const RECENT_GAMES_LIMIT = 5;

// How many months back to look for games at most, so that fetching
// "all" games from an old account stays bounded
const MAX_FETCH_MONTHS = 24;

export type RecentGamesSource = "chessCom" | "lichess";

const gameFetchers = {
    chessCom: getChessComGames,
    lichess: getLichessGames
};

/**
 * @description Recent games of a player, newest first. Months are
 * fetched going backwards until the limit is reached; pass Infinity
 * to fetch everything within the lookback window.
 */
export async function fetchRecentGames(
    source: RecentGamesSource,
    username: string,
    limit = RECENT_GAMES_LIMIT
): Promise<Game[]> {
    const now = new Date();

    const games: Game[] = [];

    for (let monthsBack = 0; monthsBack < MAX_FETCH_MONTHS; monthsBack++) {
        if (games.length >= limit) break;

        const target = new Date(
            now.getFullYear(), now.getMonth() - monthsBack, 1
        );

        const month = await gameFetchers[source](
            username, target.getMonth() + 1, target.getFullYear()
        );

        if (
            month.status != StatusCodes.OK
            && month.status != StatusCodes.NOT_FOUND
        ) {
            // The account itself is unreachable; older months are only
            // best-effort once some games have been found
            if (monthsBack == 0) throw new Error();
            break;
        }

        games.push(...(month.games || []));
    }

    return games.slice(0, limit);
}

/**
 * @description Identity of a game across fetches and the archive;
 * used to match archived analyses to games from external services.
 */
export function getGameKey(game: {
    players: Game["players"];
    date?: string;
}) {
    return [
        game.players.white.username || "",
        game.players.black.username || "",
        game.date || ""
    ].join("|").toLowerCase();
}

/**
 * @description Number of full moves played, taken from the highest
 * move number in the PGN movetext.
 */
export function getMoveCount(pgn?: string) {
    if (!pgn) return undefined;

    const movetext = pgn
        .split("\n")
        .filter(line => !line.trim().startsWith("["))
        .join(" ")
        .replace(/\{[^}]*\}/g, " ");

    const moveNumbers = movetext.match(/\b(\d+)\.(?:\.\.)?/g);

    if (!moveNumbers?.length) return undefined;

    return parseInt(moveNumbers[moveNumbers.length - 1]);
}
