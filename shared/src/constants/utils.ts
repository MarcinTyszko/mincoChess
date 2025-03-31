import { StateTreeNode } from "../types/game/position/StateTreeNode";

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const defaultRootNode: StateTreeNode = {
    mainline: true,
    children: [],
    state: {
        fen: STARTING_FEN,
        engineLines: []
    }
};