import { create } from "zustand";

import { Game } from "wintrchess";
import GameSource from "@constants/GameSource";

interface GameSelectorStore {
    selectedGameSource: GameSource;
    selectedGame: Game | null;
    
    setSelectedGameSource: (source: GameSource) => void;
    setSelectedGame: (game: Game) => void;
}

const useGameSelectorStore = create<GameSelectorStore>(set => ({
    selectedGame: null,
    selectedGameSource: GameSource.PGN,

    setSelectedGameSource(source) {
        set({ selectedGameSource: source });
    },

    setSelectedGame(game) {
        set({ selectedGame: game });
    }
}));

export default useGameSelectorStore;