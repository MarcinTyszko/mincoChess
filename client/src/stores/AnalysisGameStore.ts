import { create } from "zustand";
import { Chess } from "chess.js";
import { ParsedPGN, parse } from "pgn-parser";

import { Game } from "wintrchess";

interface AnalysisGameStore {
    analysisGame: Game | null;
    analysisGameMoveTree: ParsedPGN;
    moveTreeCursor: number[];

    setAnalysisGame: (game: Game | null) => void;
    setAnalysisGameMoveTree: (moveTree: ParsedPGN) => void;
    setMoveTreeCursor: (moveTreeCursor: number[]) => void;
}

const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    analysisGame: null,
    analysisGameMoveTree: parse(new Chess().pgn())[0],
    moveTreeCursor: [],

    setAnalysisGame(game: Game | null) {
        set({ analysisGame: game });
    },

    setAnalysisGameMoveTree(moveTree: ParsedPGN) {
        set({ analysisGameMoveTree: moveTree });
    },

    setMoveTreeCursor(moveTreeCursor: number[]) {
        set({ moveTreeCursor });
    }
}));

export default useAnalysisGameStore;