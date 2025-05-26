import { createContext } from "react";

import { SquaresController } from "./useSquares";

// eugh
export const SquaresContext = createContext<SquaresController>({
    selected: undefined,
    setSelected: () => null,
    highlighted: [],
    setHighlighted: () => null,
    playable: [],
    setPlayable: () => null,
    capturable: [],
    setCapturable: () => null,
    pieceDropFlag: false,
    setPieceDropFlag: () => null,
    toggleHighlight: () => null,
    clearPlayable: () => null,
    loadPlayable: () => null
});