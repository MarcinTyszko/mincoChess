import PlayerProfile from "../PlayerProfile";
import GameResult from "../../constants/GameResult";

interface GamePlayerProfile extends PlayerProfile {
    accuracy?: number;
    result: GameResult;
}

export default GamePlayerProfile;