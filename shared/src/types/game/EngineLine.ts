import EngineVersion from "../../constants/game/EngineVersion";
import Evaluation from "./Evaluation";
import Move from "./Move";

interface EngineLineProps {
    evaluation: Evaluation;
    source: EngineVersion;
    depth: number;
    index: number;
    moves: Move[];
}

class EngineLine {
    evaluation: Evaluation;
    source: EngineVersion;
    depth: number;
    index: number;
    moves: Move[];

    constructor(props: EngineLineProps) {
        this.evaluation = props.evaluation;
        this.source = props.source;
        this.depth = props.depth;
        this.index = props.index,
        this.moves = props.moves;
    }

    isEqual(other: EngineLine) {
        return (
            this.depth == other.depth
            && this.index == other.index
            && this.source == other.source
        );
    }
}

export default EngineLine;