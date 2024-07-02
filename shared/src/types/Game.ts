import PlayerProfile from "./PlayerProfile";
import PieceColour from "./PieceColour";

interface Game {
    pgn: string;
    initialPosition: string;
    timeControl?: string;
    isChess960: boolean;
    accuracies?: {
        white: number;
        black: number;
    };
    players?: {
        white?: PlayerProfile;
        black?: PlayerProfile;
    };
    winner?: PieceColour;
    date: Date;
}

export default Game;