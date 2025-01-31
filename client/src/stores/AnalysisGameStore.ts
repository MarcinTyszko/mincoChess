import { create } from "zustand";

import { Game } from "wintrchess";

interface AnalysisGameStore {
    analysisGame?: Game;

    setAnalysisGame: (game?: Game) => void;
}

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    setAnalysisGame(game?: Game) {
        set({ analysisGame: game });
    }
}));

export default useAnalysisGameStore;