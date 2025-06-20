import { Chess } from "chess.js";

import Game from "shared/types/game/Game";

const defaultProfileImage = require("@assets/img/defaultprofileimage.png");

export function isGameFromChessCom(game: Game) {
    const board = new Chess();
    board.loadPgn(game.pgn);

    const headers = board.getHeaders();

    return headers["Site"] == "Chess.com";
}

export async function getChessComProfileImage(
    username: string
): Promise<string> {
    if (!username) return defaultProfileImage;

    const profileResponse = await fetch(
        `https://api.chess.com/pub/player/${username}`
    );

    const profile = await profileResponse.json();

    return profile.avatar || defaultProfileImage;
}

export async function getChessComProfileImages(game: Game) {
    const board = new Chess();
    board.loadPgn(game.pgn);

    const headers = board.getHeaders();

    return {
        white: await getChessComProfileImage(headers["White"]),
        black: await getChessComProfileImage(headers["Black"])
    };
}