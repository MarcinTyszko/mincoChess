import { create } from "zustand";

import {
    AnalysedGame,
    defaultRootNode,
    Variant,
    STARTING_FEN,
    GameResult
} from "wintrchess";

interface AnalysisGameStore {
    analysisGame: AnalysedGame;
    gameAnalysisOpen: boolean;

    setAnalysisGame: (game: AnalysedGame) => void;
    setGameAnalysisOpen: (open: boolean) => void;
}

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    analysisGame: {
        pgn: "*",
        initialPosition: STARTING_FEN,
        players: {
            white: {
                username: "White",
                result: GameResult.UNKNOWN
            },
            black: {
                username: "Black",
                result: GameResult.UNKNOWN
            }
        },
        stateTree: defaultRootNode,
        variant: Variant.STANDARD
    },

    gameAnalysisOpen: false,

    setAnalysisGame(game) {
        set({ analysisGame: game });
    },

    setGameAnalysisOpen(open) {
        set({ gameAnalysisOpen: open });
    }
}));

export default useAnalysisGameStore;