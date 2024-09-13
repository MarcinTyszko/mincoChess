import GamePlayerProfile from "./GamePlayerProfile";
import Position from "./Position";

interface Game {
    pgn: string;
    initialPosition: string;
    positions?: Position[];
    timeControl?: string;
    variant: string;
    players: {
        white: GamePlayerProfile;
        black: GamePlayerProfile;
    };
    date?: Date;
}

export default Game;