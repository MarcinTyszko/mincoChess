import { Chess } from "chess.js";

import { BoardState } from "@ctypes/game/position/BoardState";
import { EngineLine } from "@ctypes/game/position/EngineLine";
import Move from "@ctypes/game/position/Move";
import Evaluation from "@ctypes/game/position/Evaluation";
import PieceColour from "@constants/PieceColour";
import BoardPiece from "./BoardPiece";

export interface ExtractedPreviousNode {
    board: Chess;
    state: BoardState;
    topLine: EngineLine;
    topMove: Move;
    evaluation: Evaluation;
    subjectiveEvaluation?: Evaluation;
    playedMove?: Move;
    moveColour?: PieceColour;
    playedPiece?: BoardPiece;
}

export interface ExtractedCurrentNode {
    board: Chess;
    state: BoardState;
    topLine: EngineLine;
    topMove?: Move;
    evaluation: Evaluation;
    subjectiveEvaluation: Evaluation;
    playedMove: Move;
    moveColour: PieceColour;
    playedPiece: BoardPiece;
}