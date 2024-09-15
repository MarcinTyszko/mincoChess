import { create } from "zustand";

import { Game } from "wintrchess";
import GameSource from "@constants/GameSource";

interface GameSelectorStore {
    selectedGameSource: GameSource;
    selectedGameInput: string;
    selectedGame: Game | null;
    
    setSelectedGameSource: (source: GameSource) => void;
    setSelectedGameInput: (input: string) => void;
    setSelectedGame: (game: Game) => void;
}

const useGameSelectorStore = create<GameSelectorStore>(set => ({
    selectedGame: null,
    selectedGameInput: "",
    selectedGameSource: GameSource.PGN,

    setSelectedGameSource(source) {
        set({ selectedGameSource: source });
    },

    setSelectedGameInput(input) {
        set({ selectedGameInput: input });
    },

    setSelectedGame(game) {
        set({ selectedGame: game });
    }
}));

export default useGameSelectorStore;