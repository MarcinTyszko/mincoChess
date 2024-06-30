import PlayerProfile from "./PlayerProfile";
import PieceColour from "./PieceColour";

interface Game {
    pgn: string;
    timeControl?: string;
    isChess960: boolean;
    initialPosition: string;
    accuracies?: {
        white: number;
        black: number;
    };
    players?: {
        white: PlayerProfile;
        black: PlayerProfile;
    };
    winner?: PieceColour;
}

export default Game;