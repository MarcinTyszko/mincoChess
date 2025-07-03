import { create } from "zustand";

import AnalysedGame from "shared/types/game/AnalysedGame";
import { defaultRootNode } from "shared/constants/utils";
import Variant from "shared/constants/game/Variant";
import GameResult from "shared/constants/game/GameResult";
import { STARTING_FEN } from "shared/constants/utils";

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