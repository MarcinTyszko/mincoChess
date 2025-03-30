import { serializeObject } from "../../../lib/serialization";
import EngineVersion from "../../../constants/game/EngineVersion";
import Evaluation from "./Evaluation";
import Move from "./Move";

interface EngineLineProps {
    evaluation: Evaluation;
    source: EngineVersion;
    depth: number;
    index: number;
    moves: Move[];
}

export type SerializedEngineLine = EngineLineProps;

export class EngineLine {
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

    serialize(): SerializedEngineLine {
        return serializeObject(this);
    }

    isEqual(other: EngineLine) {
        return (
            this.depth == other.depth
            && this.index == other.index
            && this.source == other.source
        );
    }
}

export function deserializeEngineLine(line: SerializedEngineLine) {
    return new EngineLine({ ...line });
}