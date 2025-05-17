import {
    PieceSymbol,
    PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING
} from "chess.js";
import { uniqueId } from "lodash";

import startingLines from "@resources/startingLines.json";
import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { EngineLine } from "@ctypes/game/position/EngineLine";
import Evaluation from "@ctypes/game/position/Evaluation";

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

export const defaultEvaluation: Evaluation = {
    type: "centipawn",
    value: 0
};

export const pieceNames: Record<PieceSymbol, string> = {
    [PAWN]: "Pawn",
    [KNIGHT]: "Knight",
    [BISHOP]: "Bishop",
    [ROOK]: "Rook",
    [QUEEN]: "Queen",
    [KING]: "King"
};

export const pieceValues: Record<PieceSymbol, number> = { 
    [PAWN]: 1,
    [KNIGHT]: 3,
    [BISHOP]: 3,
    [ROOK]: 5,
    [QUEEN]: 9,
    [KING]: Infinity
};

export const lichessCastlingMoves: Record<string, string> = {
    e8h8: "e8g8",
    e1h1: "e1g1",
    e8a8: "e8c8",
    e1a1: "e1c1"
};