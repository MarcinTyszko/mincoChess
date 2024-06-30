import { Game, PieceColour } from "wintrchess";

function padDateNumber(month: number) {
    const monthString = month.toString();
    return monthString.length > 1 ? monthString : "0" + monthString;
}

export async function getChessComGames(
    username: string, 
    month: number, 
    year: number
): Promise<Game[]> {
    const gamesResponse = await fetch(
        `https://api.chess.com/pub/player/${username}/games/${year}/${padDateNumber(month)}`
    );
    const games = (await gamesResponse.json()).games as any[];
    
    if (!games) return [];

    return games.map(game => {
        let winner;
        if (game.white.result == "win") winner = PieceColour.WHITE;
        if (game.black.result == "win") winner = PieceColour.BLACK;
        
        return {
            pgn: game.pgn,
            timeControl: game["time_control"],
            isChess960: game.rules == "chess960",
            initialPosition: game["initial_setup"],
            players: {
                white: {
                    username: game.white.username,
                    rating: game.white.rating
                },
                black: {
                    username: game.black.username,
                    rating: game.black.rating
                }
            },
            winner: winner
        };
    });
}