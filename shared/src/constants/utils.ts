import BoardState from "../types/game/BoardState";
import StateTreeNode from "../types/game/StateTreeNode";

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const defaultRootNode = new StateTreeNode({
    mainline: true,
    children: [],
    state: new BoardState({
        fen: STARTING_FEN
    })
});