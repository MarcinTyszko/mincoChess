import { create } from "zustand";

import { Game } from "wintrchess";

interface GameSelectorStore {
    selectedGame?: Game;
    gameSelectorError?: string;
    
    setSelectedGame: (game: Game) => void;
    setGameSelectorError: (message?: string) => void;
}

const useGameSelectorStore = create<GameSelectorStore>(set => ({
    setSelectedGame(game) {
        set({ selectedGame: game });
    },

    setGameSelectorError(message) {
        set({ gameSelectorError: message });
    }
}));

export default useGameSelectorStore;