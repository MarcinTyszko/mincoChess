import { minBy } from "lodash";

import { BoardState, getTopEngineLine } from "@ctypes/game/position/BoardState";
import { pointLossClassify } from "./pointLoss";
import Classification from "@constants/Classification";

/**
 * @description Consider brilliant classification based on a
 * state. Returns whether brilliant is recommended.
 */
export function considerBrilliantClassification(
    previousState: BoardState,
    currentState: BoardState,
    lowSampleDepth: number = 3
) {
    const previousEvaluation = getTopEngineLine(previousState)?.evaluation;

    const lowDepthSample = minBy(
        currentState.engineLines.filter(line => line.depth == lowSampleDepth),
        line => line.index
    );

    if (!previousEvaluation || !lowDepthSample) {
        return false;
    }

    const lowPointLossClassif = pointLossClassify(
        previousEvaluation,
        lowDepthSample.evaluation,
        currentState.moveColour!
    );

    return lowPointLossClassif == Classification.BLUNDER;
}