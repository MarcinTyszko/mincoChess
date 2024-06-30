import { SetStateAction } from "react";

import GameSource from "@ctypes/GameSource";

interface GameSearchMenuProps {
    username: string;
    gameSource: GameSource;
    setOpen?: (open: SetStateAction<boolean>) => void;
}

export default GameSearchMenuProps;