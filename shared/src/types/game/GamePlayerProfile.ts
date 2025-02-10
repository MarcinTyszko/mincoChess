import PlayerProfile from "../PlayerProfile";
import GameResult from "../../constants/game/GameResult";

interface GamePlayerProfile extends PlayerProfile {
    result: GameResult;
}

export default GamePlayerProfile;