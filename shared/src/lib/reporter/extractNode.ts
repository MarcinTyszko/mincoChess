import { Chess } from "chess.js";

import { StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import { BoardState, getTopEngineLine } from "@ctypes/game/position/BoardState";
import { EngineLine } from "@ctypes/game/position/EngineLine";
import Move from "@ctypes/game/position/Move";
import Evaluation from "@ctypes/game/position/Evaluation";
import PieceColour from "@constants/PieceColour";

export interface ExtractedNode {
    board: Chess;
    state: BoardState;
    topLine: EngineLine;
    topMove: Move;
    evaluation: Evaluation;
    playedMove: Move;
    moveColour: PieceColour;
}

/**
 * @description Extract analysis information from a node. Returns an object
 * of extracted data, or null if any pieces of data are missing.
 */
export function extractStateTreeNode(
    node: StateTreeNode
): ExtractedNode | null {
    const topLine = getTopEngineLine(node.state);
    if (!topLine) return null;

    const topMove = topLine.moves.at(0);
    if (!topMove) return null;

    const playedMove = node.state.move;
    if (!playedMove) return null;

    const moveColour = node.state.moveColour;
    if (!moveColour) return null;

    return {
        board: new Chess(node.state.fen),
        state: node.state,
        topLine: topLine,
        topMove: topMove,
        evaluation: topLine.evaluation,
        playedMove: playedMove,
        moveColour: moveColour
    };
}