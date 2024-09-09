import { create } from "zustand";

import { Game } from "wintrchess";

interface SelectedGameStore {
    selectedGame: Game | null;
    
    setSelectedGame: (newGame: Game) => void;
}

const useSelectedGame = create<SelectedGameStore>(set => ({
    selectedGame: null,

    setSelectedGame(newGame: Game) {
        set({ selectedGame: newGame });
    }
}));

export default useSelectedGame;