import { CSSProperties } from "react";

import { Game } from "wintrchess";

interface GameSelectorProps {
    style?: CSSProperties;
    saveCookies?: boolean;
    onChange?: (game: Game) => void;
    setError?: (message?: string) => void;
}

export default GameSelectorProps;