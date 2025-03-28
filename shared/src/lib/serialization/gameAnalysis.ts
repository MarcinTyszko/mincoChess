import GameAnalysis from "../../types/game/GameAnalysis";
import SerializedGameAnalysis from "../../types/game/serialized/SerializedGameAnalysis";
import { deserializeStateTree, serializeStateTree } from "./stateTree";

export function serializeGameAnalysis(gameAnalysis: GameAnalysis) {
    return {
        ...gameAnalysis,
        stateTree: serializeStateTree(gameAnalysis.stateTree)
    } as SerializedGameAnalysis;
}

export function deserializeGameAnalysis(gameAnalysis: SerializedGameAnalysis) {
    return {
        ...gameAnalysis,
        stateTree: deserializeStateTree(gameAnalysis.stateTree)
    } as GameAnalysis;
}