import TimeControl from "../../constants/TimeControl";
import Variant from "../../constants/Variant";
import GamePlayerProfile from "./GamePlayerProfile";
import Position from "./Position";

interface Game {
    pgn: string;
    initialPosition: string;
    positions?: Position[];
    timeControl?: TimeControl;
    variant: Variant;
    players: {
        white: GamePlayerProfile;
        black: GamePlayerProfile;
    };
    date?: Date;
}

export default Game;