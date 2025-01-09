import { create } from "zustand";

import { Square } from "react-chessboard/dist/chessboard/types";

interface ChessBoardStore {
    highlightedSquares: Square[];

    addSquareHighlight: (square: Square) => void;
    removeSquareHighlight: (square: Square) => void;
}

const useChessBoardStore = create<ChessBoardStore>(set => ({
    highlightedSquares: [],

    addSquareHighlight(square: Square) {
        set(state => ({
            highlightedSquares: [
                ...state.highlightedSquares, square
            ]
        }));
    },

    removeSquareHighlight(square: Square) {
        set(state => ({
            highlightedSquares: state.highlightedSquares.filter(
                hgSquare => hgSquare != square
            )
        }));
    }
}));

export default useChessBoardStore;