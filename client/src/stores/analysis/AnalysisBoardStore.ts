import { Dispatch, SetStateAction } from "react";
import { Square } from "react-chessboard/dist/chessboard/types";
import { create } from "zustand";

import { StateTreeNode, defaultRootNode } from "wintrchess";

interface AnalysisBoardStore {
    currentStateTreeNode: StateTreeNode;
    boardFlipped: boolean;
    autoplayEnabled: boolean;

    selectedSourceSquare?: Square;
    playableSquares: Square[];
    capturableSquares: Square[];
    highlightedSquares: Square[];

    setCurrentStateTreeNode: Dispatch<SetStateAction<StateTreeNode>>;
    setBoardFlipped: (flipped: boolean) => void;
    setAutoplayEnabled: (enabled: boolean) => void;

    setSelectedSourceSquare: (square?: Square) => void;
    setPlayableSquares: (squares: Square[]) => void;
    setCapturableSquares: (squares: Square[]) => void;
    setHighlightedSquares: Dispatch<SetStateAction<Square[]>>;
}

const useAnalysisBoardStore = create<AnalysisBoardStore>(set => ({
    currentStateTreeNode: defaultRootNode,
    boardFlipped: false,
    autoplayEnabled: false,

    playableSquares: [],
    capturableSquares: [],
    highlightedSquares: [],

    setCurrentStateTreeNode(node) {
        if (typeof node == "function") {
            return set(state => ({
                currentStateTreeNode: node(state.currentStateTreeNode)
            }));
        }
        
        set({ currentStateTreeNode: node });
    },

    setBoardFlipped(flipped) {
        set({ boardFlipped: flipped });
    },

    setAutoplayEnabled(enabled) {
        set({ autoplayEnabled: enabled });
    },

    setSelectedSourceSquare(square) {
        set({ selectedSourceSquare: square });
    },

    setPlayableSquares(squares) {
        set({ playableSquares: squares });
    },

    setCapturableSquares(squares) {
        set({ capturableSquares: squares });
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

export default useAnalysisBoardStore;