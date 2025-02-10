import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

import { StateTreeNode, defaultRootNode } from "wintrchess";

interface AnalysisBoardStore {
    currentStateTreeNode: StateTreeNode;
    boardFlipped: boolean;
    autoplayEnabled: boolean;

    setCurrentStateTreeNode: Dispatch<SetStateAction<StateTreeNode>>;
    setBoardFlipped: (flipped: boolean) => void;
    setAutoplayEnabled: (enabled: boolean) => void;
}

const useAnalysisBoardStore = create<AnalysisBoardStore>(set => ({
    currentStateTreeNode: defaultRootNode,
    boardFlipped: false,
    autoplayEnabled: false,

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
    }
}));

export default useAnalysisBoardStore;