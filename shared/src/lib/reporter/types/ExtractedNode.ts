import { Chess, Move } from "chess.js";

import { BoardState } from "@ctypes/game/position/BoardState";
import { EngineLine } from "@ctypes/game/position/EngineLine";
import Evaluation from "@ctypes/game/position/Evaluation";

export interface ExtractedPreviousNode {
    board: Chess;
    state: BoardState;
    topLine: EngineLine;
    topMove: Move;
    evaluation: Evaluation;
    subjectiveEvaluation?: Evaluation;
    playedMove?: Move;
}

export interface ExtractedCurrentNode {
    board: Chess;
    state: BoardState;
    topLine: EngineLine;
    topMove?: Move;
    evaluation: Evaluation;
    subjectiveEvaluation: Evaluation;
    playedMove: Move;
}