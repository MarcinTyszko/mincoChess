import { createContext } from "react";
import { Square } from "react-chessboard/dist/chessboard/types";

interface HighlightedSquares {
    highlightedSquares: Square[];

    addSquareHighlight?: (square: Square) => void;
    removeSquareHighlight?: (square: Square) => void;
}

const HighlightedSquaresContext = createContext<HighlightedSquares>({
    highlightedSquares: []
});

export default HighlightedSquaresContext;