import GamePlayerProfile from "./GamePlayerProfile";

interface Game {
    pgn: string;
    initialPosition: string;
    timeControl?: string;
    variant: string;
    players: {
        white: GamePlayerProfile;
        black: GamePlayerProfile;
    };
    date?: Date;
}

export default Game;