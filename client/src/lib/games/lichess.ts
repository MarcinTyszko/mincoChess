import {
    Game,
    GameResult,
    PieceColour,
    TimeControl,
    Variant,
    oppositePieceColour
} from "wintrchess";
import { getMonthLength, padDateNumber } from "@lib/utils/date";
import { UserNotFoundError, RatelimitError } from "../errors";

// Loser's result based on game status defined by Lichess API
const loserResults: { [key: string]: GameResult } = {
    aborted: GameResult.ABANDONED,
    cheat: GameResult.LOSE,
    draw: GameResult.AGREED,
    mate: GameResult.CHECKMATED,
    outoftime: GameResult.TIMEOUT,
    resign: GameResult.RESIGNED,
    stalemate: GameResult.STALEMATE,
    timeout: GameResult.ABANDONED
};

// Map from Lichess time controls to ours
const timeControlCodes: { [key: string]: TimeControl } = {
    ultraBullet: TimeControl.BULLET,
    bullet: TimeControl.BULLET,
    blitz: TimeControl.RAPID,
    classical: TimeControl.CLASSICAL,
    correspondence: TimeControl.CORRESPONDENCE
};

// Map from Lichess variants to ours
const variantCodes: { [key: string]: Variant } = {
    standard: Variant.STANDARD,
    chess960: Variant.CHESS960
};

async function getLichessGames(
    username: string, 
    month: number, 
    year: number
): Promise<Game[]> {
    const monthStart = new Date(
        `${year}-${padDateNumber(month)}-01T00:00:00.000Z`
    );

    const monthEnd = new Date(
        `${year}-${padDateNumber(month)}-${getMonthLength(month)}`
        + "T23:59:59.999Z"
    );

    let gamesResponse: Response;
    try {
        gamesResponse = await fetch(
            `https://lichess.org/api/games/user/${username}`
            + `?since=${monthStart.getTime()}`
            + `&until=${monthEnd.getTime()}`
            + "&pgnInJson=true",
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

            results[oppositePieceColour(winner)] = (
                loserResults[game.status] || GameResult.AGREED
            );
        }

        return {
            pgn: game.pgn,
            initialPosition: game.initialFen,
            timeControl: (
                timeControlCodes[game.speed] || TimeControl.CORRESPONDENCE
            ),
            variant: variantCodes[game.variant] || Variant.STANDARD,
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