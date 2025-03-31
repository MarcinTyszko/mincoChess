import { StateTreeNode } from "./position/StateTreeNode";

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