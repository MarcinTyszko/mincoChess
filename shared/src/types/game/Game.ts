import TimeControl from "../../constants/TimeControl";
import Variant from "../../constants/Variant";
import GamePlayerProfile from "./GamePlayerProfile";
import GameReport from "./GameReport";

interface Game {
    pgn: string;
    initialPosition: string;
    timeControl?: TimeControl;
    variant: Variant;
    players: {
        white: GamePlayerProfile;
        black: GamePlayerProfile;
    };
    date?: Date;
    report?: GameReport;
}

export default Game;