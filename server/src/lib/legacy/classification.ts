import { Classification } from "wintrchess";

export const classificationValues: Record<Classification, number> = {
    [Classification.BLUNDER]: 0,
    [Classification.MISTAKE]: 0.2,
    [Classification.INACCURACY]: 0.4,
    [Classification.OKAY]: 0.65,
    [Classification.EXCELLENT]: 0.9,
    [Classification.BEST]: 1,
    [Classification.ONLY]: 1,
    [Classification.BRILLIANT]: 1,
    [Classification.THEORY]: 1,
    [Classification.FORCED]: 1,
    [Classification.RISKY]: 1
};

// Classification types with no special rules
export const centipawnClassifications = [
    Classification.BEST,
    Classification.EXCELLENT,
    Classification.OKAY,
    Classification.INACCURACY,
    Classification.MISTAKE,
    Classification.BLUNDER
];

// WTF Algorithm
// Get the maximum evaluation loss for a classification to be applied
// Evaluation loss threshold for excellent in a previously equal position is 30
export function getEvaluationLossThreshold(classif: Classification, prevEval: number) {
    prevEval = Math.abs(prevEval);

    let threshold = 0;

    switch (classif) {
        case Classification.BEST:
            threshold = 0.0001 * Math.pow(prevEval, 2) + (0.0236 * prevEval) - 3.7143;
            break;
        case Classification.EXCELLENT:
            threshold = 0.0002 * Math.pow(prevEval, 2) + (0.1231 * prevEval) + 27.5455;
            break;
        case Classification.OKAY:
            threshold = 0.0002 * Math.pow(prevEval, 2) + (0.2643 * prevEval) + 60.5455;
            break;
        case Classification.INACCURACY:
            threshold = 0.0002 * Math.pow(prevEval, 2) + (0.3624 * prevEval) + 108.0909;
            break;
        case Classification.MISTAKE:
            threshold = 0.0003 * Math.pow(prevEval, 2) + (0.4027 * prevEval) + 225.8182;
            break;
        default:
            threshold = Infinity;
    }

    return Math.max(threshold, 0);
}