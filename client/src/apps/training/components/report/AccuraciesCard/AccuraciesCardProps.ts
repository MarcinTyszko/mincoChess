import { GameAnalysis } from "wintrchess";

interface AccuraciesCardProps {
    accuracies: NonNullable<GameAnalysis["accuracies"]>;
    estimatedRatings?: GameAnalysis["estimatedRatings"];
}

export default AccuraciesCardProps;