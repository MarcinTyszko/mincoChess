import { create } from "zustand";

import { Game } from "wintrchess";

interface LoadedGameStore {
    loadedGame: Game | null;

    setLoadedGame: (game: Game | null) => void;
}

const useLoadedGameStore = create<LoadedGameStore>(set => ({
    loadedGame: null,

    setLoadedGame(game: Game | null) {
        set({ loadedGame: game });
    }
}));

export default useLoadedGameStore;