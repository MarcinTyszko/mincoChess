import { maxBy } from "lodash";

import { EngineLine } from "./EngineLine";
import Classification from "@constants/Classification";
import PieceColour from "@constants/PieceColour";
import Move from "./Move";

export interface BoardState {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines: EngineLine[];
    classification?: Classification;
    accuracy?: number;
    opening?: string;
}

/**
 * @description Returns the line with the highest depth and lowest index.
 */
export function getTopEngineLine(state: BoardState) {
    return maxBy(
        state.engineLines,
        line => line.depth - line.index
    );
}