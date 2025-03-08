import EngineVersion from "../../constants/game/EngineVersion";
import Evaluation from "./Evaluation";
import Move from "./Move";

interface EngineLine {
    evaluation: Evaluation;
    source: EngineVersion;
    depth: number;
    index: number;
    moves: Move[];
}

export default EngineLine;