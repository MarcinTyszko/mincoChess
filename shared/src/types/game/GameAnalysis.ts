import { cloneDeep, omit } from "lodash";

import {
    StateTreeNode,
    SerializedStateTreeNode,
    deserializeStateTree
} from "./position/StateTreeNode";

export interface GameAnalysis {
    accuracies?: {
        white: number;
        black: number;
    };
    estimatedRatings?: {
        white: number;
        black: number;
    };
    stateTree: StateTreeNode;
}

export type SerializedGameAnalysis = (
    Omit<GameAnalysis, "stateTree">
    & { stateTree: SerializedStateTreeNode }
);

export function serializeGameAnalysis(
    gameAnalysis: GameAnalysis
): SerializedGameAnalysis {
    return {
        ...cloneDeep(omit(gameAnalysis, "stateTree")),
        stateTree: gameAnalysis.stateTree.serialize()
    };
}

export function deserializeGameAnalysis(
    gameAnalysis: SerializedGameAnalysis
): GameAnalysis {
    return {
        ...cloneDeep(omit(gameAnalysis, "stateTree")),
        stateTree: deserializeStateTree(gameAnalysis.stateTree)
    };
}