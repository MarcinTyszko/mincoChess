import TimeControl from "@constants/game/TimeControl";
import Variant from "@constants/game/Variant";
import GamePlayerProfile from "./GamePlayerProfile";
import PieceColour from "@constants/PieceColour";

export function getColourPlayed(game: Game, username: string) {
    return game.players.white.username?.toLowerCase() == username.toLowerCase()
        ? PieceColour.WHITE : PieceColour.BLACK;
}

export interface Game {
    pgn: string;
    initialPosition: string;
    timeControl?: TimeControl;
    variant: Variant;
    players: {
        white: GamePlayerProfile;
        black: GamePlayerProfile;
    };
    date?: Date;
}

export default Game;