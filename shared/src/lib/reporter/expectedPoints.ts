import Evaluation from "@ctypes/game/position/Evaluation";
import PieceColour from "@constants/PieceColour";

interface ExpectedPointsOptions {
    moveColour?: PieceColour;
    centipawnGradient?: number;
}

/**
 * @description Returns white's probability of winning
 * (expected points) given an evaluation and move colour
 */
export function getExpectedPoints(
    evaluation: Evaluation,
    options?: ExpectedPointsOptions
) {
    const opts = {
        moveColour: PieceColour.WHITE,
        centipawnGradient: 0.0035,
        ...options
    };

    if (evaluation.type == "mate") {
        if (evaluation.value == 0) {
            return Number(opts.moveColour == PieceColour.WHITE);
        }

        return Number(evaluation.value > 0);
    } else {
        return 1 / (1 + Math.pow(
            Math.E,
            -opts.centipawnGradient * evaluation.value
        ));
    }
}