import { Chess } from "chess.js";

import Evaluation from "./Evaluation";

interface Position {
    board: Chess;
    engineLines?: {
        local: Evaluation[];
        cloud: Evaluation[];
    };
}

export default Position;