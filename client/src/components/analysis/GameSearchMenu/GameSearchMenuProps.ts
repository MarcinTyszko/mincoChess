import { Dispatch, SetStateAction } from "react";

import { Game } from "wintrchess";
import GameSource from "@constants/GameSource";

interface GameSearchMenuProps {
    username: string;
    gameSource: GameSource;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    setSelectedGame?: (game: Game) => void;
}

export default GameSearchMenuProps;