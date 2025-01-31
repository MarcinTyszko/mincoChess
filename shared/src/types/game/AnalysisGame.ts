import Game from "./Game";
import StateTreeNode from "./StateTreeNode";

interface AnalysisGame extends Game {
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

export default AnalysisGame;