import { Dispatch, SetStateAction } from "react";

import GameSource from "@constants/GameSource";

interface GameSearchMenuProps {
    username: string;
    gameSource: GameSource;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default GameSearchMenuProps;