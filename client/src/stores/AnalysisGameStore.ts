import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

import {
    AnalysisGame,
    StateTreeNode,
    Variant,
    STARTING_FEN
} from "wintrchess";

interface AnalysisGameStore {
    analysisGame: AnalysisGame;
    currentStateTreeNode: StateTreeNode;

    setAnalysisGame: (game: AnalysisGame) => void;
    setCurrentStateTreeNode: Dispatch<SetStateAction<StateTreeNode>>;
}

const defaultRootNode = new StateTreeNode({
    mainline: true,
    children: [],
    state: {
        fen: STARTING_FEN,
        engineLines: {}
    }
});

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    currentStateTreeNode: defaultRootNode,

    analysisGame: {
        pgn: "",
        accuracies: {
            black: 0,
            white: 0
        },
        estimatedRatings: {
            white: 0,
            black: 0
        },
        initialPosition: STARTING_FEN,
        players: {
            white: { username: "White" },
            black: { username: "Black" }
        },
        stateTree: defaultRootNode,
        variant: Variant.STANDARD
    },

    setAnalysisGame(game) {
        set({ analysisGame: game });
    },

    setCurrentStateTreeNode(node) {
        if (typeof node == "function") {
            return set(state => ({
                currentStateTreeNode: node(state.currentStateTreeNode)
            }));
        }
        
        set({ currentStateTreeNode: node });
    }
}));

export default useAnalysisGameStore;