import StateTreeNode from "./StateTreeNode";

interface GameAnalysis {
    accuracies: {
        white: number;
        black: number;
    };
    estimatedRatings: {
        white: number;
        black: number;
    };
    stateTree: StateTreeNode;
}

export default GameAnalysis;