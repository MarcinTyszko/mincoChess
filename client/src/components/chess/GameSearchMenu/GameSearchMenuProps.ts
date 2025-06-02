import { Game } from "wintrchess";
import { GameSourceData } from "@components/chess/GameSelector/GameSource";

interface GameSearchMenuProps {
    username: string;
    gameSource: GameSourceData;
    onClose: () => void;
    onGameSelect?: (game: Game) => void;
}

export default GameSearchMenuProps;