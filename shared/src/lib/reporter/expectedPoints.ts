import Evaluation from "@ctypes/game/position/Evaluation";
import PieceColour from "@constants/PieceColour";

interface ExpectedPointsOptions {
    moveColour?: PieceColour;
    mateStrictness?: number;
    centipawnStrictness?: number;
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
        mateGradient: 0.05,
        centipawnGradient: 0.0035,
        ...options
    };

    if (evaluation.type == "mate") {
        if (evaluation.value == 0) {
            return Number(opts.moveColour == PieceColour.WHITE);
        }

        const winProbability = Math.max(
            0.5,
            -opts.mateGradient * Math.abs(evaluation.value) + 1
        );

        return evaluation.value > 0
            ? winProbability
            : 1 - winProbability;
    } else {
        return 1 / (1 + Math.pow(
            Math.E,
            -opts.centipawnGradient * evaluation.value
        ));
    }
}