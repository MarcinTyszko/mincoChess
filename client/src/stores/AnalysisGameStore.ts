import { create } from "zustand";

import { AnalysisGame } from "wintrchess";

interface AnalysisGameStore {
    analysisGame?: AnalysisGame;

    setAnalysisGame: (game?: AnalysisGame) => void;
}

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    setAnalysisGame(game?: AnalysisGame) {
        set({ analysisGame: game });
    }
}));

export default useAnalysisGameStore;