import { Chess } from "chess.js";

import Position from "./Position";

interface GameReport {
    board: Chess;
    accuracies: {
        white: number;
        black: number;
    };
    estimatedRatings: {
        white: number;
        black: number;
    };
    positions: Position[];
}

export default GameReport;