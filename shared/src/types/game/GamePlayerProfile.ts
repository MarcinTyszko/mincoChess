import PlayerProfile from "../PlayerProfile";
import GameResult from "../../constants/GameResult";

interface GamePlayerProfile extends PlayerProfile {
    result: GameResult;
}

export default GamePlayerProfile;