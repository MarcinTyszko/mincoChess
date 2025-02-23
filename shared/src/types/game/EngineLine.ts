import Evaluation from "./Evaluation";
import Move from "./Move";

interface EngineLine {
    evaluation: Evaluation;
    depth: number;
    index: number;
    moves: Move[];
}

export default EngineLine;