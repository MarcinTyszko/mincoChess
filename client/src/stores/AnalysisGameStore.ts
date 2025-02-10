import { create } from "zustand";

import {
    AnalysisGame,
    defaultRootNode,
    Variant,
    STARTING_FEN,
    GameResult
} from "wintrchess";

interface AnalysisGameStore {
    analysisGame: AnalysisGame;
    gameAnalysisOpen: boolean;

    setAnalysisGame: (game: AnalysisGame) => void;
    setGameAnalysisOpen: (open: boolean) => void;
}

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    analysisGame: {
        pgn: "",
        accuracies: {
            black: 0,
            white: 0
        },
        estimatedRatings: {
            white: 0,
            black: 0
        },
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