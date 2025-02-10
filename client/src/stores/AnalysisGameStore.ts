import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

import {
    AnalysisGame,
    StateTreeNode,
    Variant,
    STARTING_FEN,
    GameResult
} from "wintrchess";

interface AnalysisGameStore {
    analysisGame: AnalysisGame;
    currentStateTreeNode: StateTreeNode;
    gameAnalysisOpen: boolean;
    autoplayEnabled: boolean;

    setAnalysisGame: (game: AnalysisGame) => void;
    setCurrentStateTreeNode: Dispatch<SetStateAction<StateTreeNode>>;
    setGameAnalysisOpen: (open: boolean) => void;
    setAutoplayEnabled: (enabled: boolean) => void;
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
    gameAnalysisOpen: false,
    autoplayEnabled: false,

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
            white: {
                username: "White",
                result: GameResult.UNKNOWN
            },
            black: {
                username: "Black",
                result: GameResult.UNKNOWN
            }
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
    },

    setGameAnalysisOpen(open) {
        set({ gameAnalysisOpen: open });
    },

    setAutoplayEnabled(enabled) {
        set({ autoplayEnabled: enabled });
    }
}));

export default useAnalysisGameStore;