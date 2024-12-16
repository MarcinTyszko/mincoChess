import TimeControl from "../../constants/game/TimeControl";
import Variant from "../../constants/game/Variant";
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