import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { Square } from "react-chessboard/dist/chessboard/types";

interface BoardSquaresStore {
    selectedSourceSquare?: Square;
    playableSquares: Square[];
    highlightedSquares: Square[];
    
    setSelectedSourceSquare: (square?: Square) => void;
    setPlayableSquares: (squares: Square[]) => void;
    setHighlightedSquares: Dispatch<SetStateAction<Square[]>>;
}

const useBoardSquaresStore = create<BoardSquaresStore>(set => ({
    playableSquares: [],
    highlightedSquares: [],

    setSelectedSourceSquare(square) {
        set({ selectedSourceSquare: square });
    },

    setPlayableSquares(squares) {
        set({ playableSquares: squares });
    },

    setHighlightedSquares(squares) {
        if (typeof squares == "function") {
            return set(state => ({
                highlightedSquares: squares(state.highlightedSquares)
            }));
        }

        set({ highlightedSquares: squares });
    }
}));

export default useBoardSquaresStore;