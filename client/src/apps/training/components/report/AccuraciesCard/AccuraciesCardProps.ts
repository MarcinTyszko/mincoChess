import { GameAnalysis } from "wintrchess";

interface AccuraciesCardProps {
    accuracies: {
        white: number;
        black: number;
    };
    estimatedRatings?: GameAnalysis["estimatedRatings"];
}

export default AccuraciesCardProps;