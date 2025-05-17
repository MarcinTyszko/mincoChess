import { EngineLine } from "./EngineLine";
import Move from "./Move";
import { Classification } from "@constants/Classification";
import PieceColour from "@constants/PieceColour";

export interface BoardState {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines: EngineLine[];
    classification?: Classification;
    accuracy?: number;
    opening?: string;
}