import { StateTreeNode } from "./position/StateTreeNode";

export interface GameAnalysis {
    estimatedRatings: {
        white: number;
        black: number;
    };
    stateTree: StateTreeNode;
}