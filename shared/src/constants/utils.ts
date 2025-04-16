import { PieceSymbol } from "chess.js";
import { uniqueId } from "lodash";

import startingLines from "@resources/startingLines.json";
import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { EngineLine } from "@ctypes/game/position/EngineLine";

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const defaultRootNode: StateTreeNode = {
    id: uniqueId(),
    mainline: true,
    children: [],
    state: {
        fen: STARTING_FEN,
        engineLines: startingLines as EngineLine[]
    }
};

export const pieceValues: Record<PieceSymbol, number> = {
    k: Infinity,
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9
};