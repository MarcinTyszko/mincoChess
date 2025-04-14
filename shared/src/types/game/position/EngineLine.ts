import EngineVersion from "@constants/game/EngineVersion";
import Evaluation from "./Evaluation";
import Move from "./Move";

export interface EngineLine {
    evaluation: Evaluation;
    source: EngineVersion;
    depth: number;
    index: number;
    moves: Move[];
}

export function isEngineLineEqual(line: EngineLine, other: EngineLine) {
    return (
        line.depth == other.depth
        && line.index == other.index
        && line.source == other.source
    );
}