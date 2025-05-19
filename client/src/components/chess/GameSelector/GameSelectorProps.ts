import { CSSProperties } from "react";

import { Game } from "wintrchess";

interface GameSelectorProps {
    style?: CSSProperties;
    saveLocalStorage?: boolean;
    onGameSelect?: (game: Game | string | null) => void;
}

export default GameSelectorProps;