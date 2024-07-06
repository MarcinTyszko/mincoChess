import { SetStateAction } from "react";

import GameSource from "@constants/GameSource";

interface GameSearchMenuProps {
    username: string;
    gameSource: GameSource;
    setOpen?: (open: SetStateAction<boolean>) => void;
}

export default GameSearchMenuProps;