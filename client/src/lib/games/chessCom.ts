import {
    Game,
    GameResult,
    TimeControl,
    Variant,
    padDateNumber,
    STARTING_FEN
} from "wintrchess";
import { UserNotFoundError } from "../errors";

// Map from chess.com time controls to ours
const timeControlCodes: Record<string, TimeControl | undefined> = {
    bullet: TimeControl.BULLET,
    blitz: TimeControl.BLITZ,
    rapid: TimeControl.RAPID,
    daily: TimeControl.CORRESPONDENCE
};

// Map from chess.com variants to ours
const variantCodes: Record<string, Variant | undefined> = {
    chess: Variant.STANDARD,
    chess960: Variant.CHESS960
};

// Map from chess.com game results to ours
const gameResultCodes: Record<string, GameResult | undefined> = {
    win: GameResult.WIN,
    checkmated: GameResult.LOSE,
    agreed: GameResult.DRAW,
    repetition: GameResult.DRAW,
    timeout: GameResult.LOSE,
    resigned: GameResult.LOSE,
    stalemate: GameResult.DRAW,
    lose: GameResult.LOSE,
    insufficient: GameResult.DRAW,
    "50move": GameResult.DRAW,
    abandoned: GameResult.LOSE,
    timevsinsufficient: GameResult.DRAW
};

async function getChessComGames(
    username: string,
    month: number,
    year: number
): Promise<Game[]> {
    const gamesResponse = await fetch(
        `https://api.chess.com/pub/player/${username}`
        + `/games/${year}/${padDateNumber(month)}`
    );

    if (gamesResponse.status == 404) {
        throw new UserNotFoundError(
            "pages.analysis.gameSearchMenu.userNotFound"
        );
    }

    const games: any[] | undefined = (await gamesResponse.json()).games;
    
    if (!games) return [];

    return games
        .reverse()
        .filter(game => Object
            .keys(variantCodes)
            .includes(game.rules)
        )
        .map(game => ({
            pgn: game.pgn,
            timeControl: (
                timeControlCodes[game["time_class"]]
                || TimeControl.CORRESPONDENCE
            ),
            variant: variantCodes[game.rules] || Variant.STANDARD,
            initialPosition: game["initial_setup"] || STARTING_FEN,
            players: {
                white: {
                    username: game.white.username,
                    rating: game.white.rating,
                    result: gameResultCodes[game.white.result] || GameResult.UNKNOWN
                },
                black: {
                    username: game.black.username,
                    rating: game.black.rating,
                    result: gameResultCodes[game.black.result] || GameResult.UNKNOWN
                }
            },
            date: new Date(game["end_time"] * 1000)
        }));
}

export default getChessComGames;