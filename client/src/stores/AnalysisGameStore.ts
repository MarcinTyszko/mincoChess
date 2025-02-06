import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

import {
    AnalysisGame,
    StateTreeNode,
    STARTING_FEN
} from "wintrchess";

interface AnalysisGameStore {
    analysisGame?: AnalysisGame;
    currentStateTreeNode: StateTreeNode;

    setAnalysisGame: (game?: AnalysisGame) => void;
    setCurrentStateTreeNode: Dispatch<SetStateAction<StateTreeNode>>;
}

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    currentStateTreeNode: new StateTreeNode({
        mainline: true,
        children: [],
        state: {
            fen: STARTING_FEN,
            engineLines: {}
        }
    }),

    setAnalysisGame(game?: AnalysisGame) {
        set({ analysisGame: game });
    },

    setCurrentStateTreeNode(node: SetStateAction<StateTreeNode>) {
        if (typeof node == "function") {
            return set(state => ({
                currentStateTreeNode: node(state.currentStateTreeNode)
            }));
        }
        
        set({ currentStateTreeNode: node });
    }
}));

export default useAnalysisGameStore;