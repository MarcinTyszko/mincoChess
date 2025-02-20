import { Game } from "wintrchess";
import GameSource from "@constants/GameSource";

interface GameSearchMenuProps {
    username: string;
    gameSource: GameSource;
    setOpen: (open: boolean) => void;
    setSelectedGame?: (game: Game) => void;
}

export default GameSearchMenuProps;