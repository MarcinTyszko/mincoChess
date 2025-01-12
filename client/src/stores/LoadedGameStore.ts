import { create } from "zustand";
import { ParsedPGN } from "pgn-parser";

import { Game } from "wintrchess";

interface LoadedGameStore {
    loadedGame: Game | null;
    loadedMoveTree: ParsedPGN | null;
    moveTreeCursor: number[];

    setLoadedGame: (game: Game | null) => void;
    setLoadedMoveTree: (moveTree: ParsedPGN | null) => void;
    setMoveTreeCursor: (moveTreeCursor: number[]) => void;
}

const useLoadedGameStore = create<LoadedGameStore>(set => ({
    loadedGame: null,
    loadedMoveTree: null,
    moveTreeCursor: [],

    setLoadedGame(game: Game | null) {
        set({ loadedGame: game });
    },

    setLoadedMoveTree(moveTree: ParsedPGN | null) {
        set({ loadedMoveTree: moveTree });
    },

    setMoveTreeCursor(moveTreeCursor: number[]) {
        set({ moveTreeCursor });
    }
}));

export default useLoadedGameStore;