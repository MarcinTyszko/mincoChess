import Classification from "@constants/Classification";
import PieceColour from "@constants/PieceColour";
import Evaluation from "@ctypes/game/position/Evaluation";
import { getExpectedPoints } from "../expectedPoints";

/**
 * @description Classify using two evaluations and a move colour,
 * using expected point losses or mate losses.
 */
export function pointLossClassify(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    // xP for all mate evaluations are 1 or 0, so handle
    // mate to mate moves separately.
    if (
        previousEvaluation.type == "mate"
        && currentEvaluation.type == "mate"
    ) {
        const mateLoss = (
            (currentEvaluation.value - previousEvaluation.value)
            * (moveColour == PieceColour.WHITE ? 1 : -1)
        );

        // For the losing side, making a move that keeps the mate the same
        // is best. Only the winning side expects a mate loss of -1.
        const subjectiveMate = currentEvaluation.value * (
            (moveColour == PieceColour.WHITE ? 1 : -1)
        );

        if (
            mateLoss < 0
            || (mateLoss == 0 && subjectiveMate < 0)
        ) {
            return Classification.BEST;
        } else if (mateLoss < 2) {
            return Classification.EXCELLENT;
        } else if (mateLoss < 7) {
            return Classification.OKAY;
        } else {
            return Classification.INACCURACY;
        }
    }

    const pointLoss = Math.max(0,
        (
            getExpectedPoints(previousEvaluation)
            - getExpectedPoints(currentEvaluation)
        )
        * (moveColour == PieceColour.WHITE ? 1 : -1)
    );

    if (pointLoss < 0.01) {
        return Classification.BEST;
    } else if (pointLoss < 0.045) {
        return Classification.EXCELLENT;
    } else if (pointLoss < 0.08) {
        return Classification.OKAY;
    } else if (pointLoss < 0.12) {
        return Classification.INACCURACY;
    } else if (pointLoss < 0.24) {
        return Classification.MISTAKE;
    } else {
        return Classification.BLUNDER;
    }
}