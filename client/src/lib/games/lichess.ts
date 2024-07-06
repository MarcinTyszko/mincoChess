import { 
    Game,
    GameResult,
    PieceColour,
    oppositePieceColour
} from "wintrchess";
import { getMonthLength } from "@lib/utils/date";
import { UserNotFoundError, RatelimitError } from "./errors";

const gameStatuses = [
    "created",
    "started",
    "aborted",
    "mate",
    "resign",
    "stalemate",
    "timeout",
    "draw",
    "outoftime",
    "cheat",
    "noStart",
    "unknownFinish",
    "variantEnd"
] as const;
type LichessGameStatus = typeof gameStatuses[number];

function getLoserResult(gameStatus: LichessGameStatus): GameResult {
    switch (gameStatus) {
        case "aborted":
            return GameResult.ABANDONED;
        case "cheat":
            return GameResult.LOSE;
        case "draw":
            return GameResult.AGREED;
        case "mate":
            return GameResult.CHECKMATED;
        case "noStart":
            return GameResult.AGREED;
        case "outoftime":
            return GameResult.TIMEOUT;
        case "resign":
            return GameResult.RESIGNED;
        case "stalemate":
            return GameResult.STALEMATE;
        case "timeout":
            return GameResult.ABANDONED;
        case "unknownFinish":
            return GameResult.AGREED;
    }

    return GameResult.AGREED;
}

async function getLichessGames(
    username: string, 
    month: number, 
    year: number
): Promise<Game[]> {
    const monthStart = new Date();
    monthStart.setUTCFullYear(year);
    monthStart.setUTCMonth(month);
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);

    const monthEnd = new Date();
    monthEnd.setUTCFullYear(year);
    monthEnd.setUTCMonth(month);
    monthEnd.setUTCDate(getMonthLength(month));
    monthEnd.setUTCHours(23, 59, 59, 999);

    let gamesResponse: Response;
    try {
        gamesResponse = await fetch(
            `https://lichess.org/api/games/user/${username}` +
            `?since=${monthStart.getTime()}` +
            `&until=${monthEnd.getTime()}` +
            "&pgnInJson=true",
            {
                headers: {
                    Accept: "application/x-ndjson"
                }
            }
        );
    } catch {
        throw new RatelimitError(
            "pages.analysis.gameSearchMenu.ratelimited"
        );
    }

    if (gamesResponse.status == 404) {
        throw new UserNotFoundError(
            "pages.analysis.gameSearchMenu.userNotFound"
        );
    }

    // Games are received in ND-JSON format
    // Last empty line is filtered out and JSON strings are parsed
    const undelimitedGames = await gamesResponse.text();
    const games = undelimitedGames
        .split("\n")
        .filter(game => game.length > 0)
        .map(game => JSON.parse(game));

    return games.map(game => {
        const results = {
            [PieceColour.WHITE]: GameResult.AGREED,
            [PieceColour.BLACK]: GameResult.AGREED
        };

        // If there's a winner, set the result of the loser based on the
        // game's status, and set the winner's result to WIN
        const winner: PieceColour | undefined = game.winner;
        if (winner) {
            results[winner] = GameResult.WIN;
            results[oppositePieceColour(winner)] = getLoserResult(game.status);
        }

        return {
            pgn: game.pgn,
            initialPosition: game.initialFen,
            timeControl: game.speed,
            variant: game.variant,
            players: {
                white: {
                    username: game.players.white.user.name,
                    rating: game.players.white.rating,
                    title: game.players.white.user.title,
                    result: results[PieceColour.WHITE]
                },
                black: {
                    username: game.players.black.user.name,
                    rating: game.players.black.rating,
                    title: game.players.black.user.title,
                    result: results[PieceColour.BLACK]
                }
            },
            date: new Date(game.lastMoveAt)
        };
    });
}

export default getLichessGames;