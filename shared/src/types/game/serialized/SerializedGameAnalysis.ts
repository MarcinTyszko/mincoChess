import SerializedStateTreeNode from "./SerializedStateTreeNode";

interface SerializedGameAnalysis {
    accuracies?: {
        white: number;
        black: number;
    };
    estimatedRatings?: {
        white: number;
        black: number;
    };
    stateTree: SerializedStateTreeNode;
}

export default SerializedGameAnalysis;