import { Chess } from "chess.js";

import BoardState from "./BoardState";

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
    positions: BoardState[];
}

export default GameReport;