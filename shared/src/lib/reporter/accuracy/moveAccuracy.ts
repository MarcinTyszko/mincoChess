import Evaluation from "@/types/game/position/Evaluation";
import PieceColour from "@/constants/PieceColour";
import { getExpectedPointsLoss } from "../expectedPoints";

export function getMoveAccuracy(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    const pointLoss = getExpectedPointsLoss(
        previousEvaluation,
        currentEvaluation,
        moveColour
    );

    return 103.16 * Math.exp(-4 * pointLoss) - 3.17;
}