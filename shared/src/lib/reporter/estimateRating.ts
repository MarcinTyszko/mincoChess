import { clamp, round, sumBy } from "lodash-es";

import PieceColour from "@/constants/PieceColour";
import { Classification } from "@/constants/Classification";
import Evaluation from "@/types/game/position/Evaluation";

export enum GamePhase {
    OPENING = "opening",
    MIDDLEGAME = "middlegame",
    ENDGAME = "endgame"
}

export interface RatedMoveRecord {
    colour: PieceColour;
    accuracy?: number;
    classification?: Classification;
    centipawnLoss: number;
    phase: GamePhase;
}

export interface DeclaredRatings {
    white?: number;
    black?: number;
}

const RATING_FLOOR = 400;
const RATING_CEILING = 2800;

// A single move may lose at most this many centipawns; keeps one blunder
// in an otherwise clean game from dominating the whole estimate
const CENTIPAWN_LOSS_CAP = 300;

// Mistakes in the opening say more about a player's strength than
// mistakes in a long endgame grind
const phaseWeights: Record<GamePhase, number> = {
    [GamePhase.OPENING]: 1.25,
    [GamePhase.MIDDLEGAME]: 1,
    [GamePhase.ENDGAME]: 0.65
};

const errorPenaltyWeights: Partial<Record<Classification, number>> = {
    [Classification.BLUNDER]: 3500,
    [Classification.MISTAKE]: 1800,
    [Classification.INACCURACY]: 700
};

/**
 * @description Rough phase heuristic; endgame once few non-pawn pieces
 * remain, opening while inside book theory or the early move numbers.
 */
export function getGamePhase(
    fen: string,
    moveNumber: number,
    inTheory = false
): GamePhase {
    const fenPieces = fen.split(" ").at(0) || "";

    const heavyPieceCount = fenPieces
        .split("")
        .filter(char => /[a-z]/i.test(char) && !/[kp]/i.test(char))
        .length;

    if (heavyPieceCount <= 6) return GamePhase.ENDGAME;

    if (inTheory || moveNumber <= 10) return GamePhase.OPENING;

    return GamePhase.MIDDLEGAME;
}

function getComparableCentipawns(evaluation: Evaluation) {
    if (evaluation.type == "centipawn") {
        return clamp(evaluation.value, -1500, 1500);
    }

    // Treat mates as decisive material advantages
    if (evaluation.value == 0) return 0;

    return evaluation.value > 0 ? 1500 : -1500;
}

/**
 * @description Centipawns lost by the mover between two evaluations,
 * capped for stability.
 */
export function getCentipawnLoss(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    const lossForWhite = (
        getComparableCentipawns(previousEvaluation)
        - getComparableCentipawns(currentEvaluation)
    );

    const loss = moveColour == PieceColour.WHITE
        ? lossForWhite
        : -lossForWhite;

    return clamp(loss, 0, CENTIPAWN_LOSS_CAP);
}

function getRatingFromCentipawnLoss(averageLoss: number) {
    return RATING_FLOOR + 2400 * Math.exp(-averageLoss / 90);
}

function getRatingFromAccuracy(accuracy: number) {
    const normalised = clamp((accuracy - 20) / 80, 0, 1);

    return RATING_FLOOR + 2400 * Math.pow(normalised, 1.6);
}

/**
 * @description Map a player's analysed moves onto an Elo estimate within
 * 400 - 2800. Blends a phase-weighted average centipawn loss curve with
 * an accuracy curve, subtracts a penalty for the density of blunders,
 * mistakes and inaccuracies, and finally anchors the result towards the
 * player's declared rating when one is available.
 */
export function estimatePlayerRating(
    records: RatedMoveRecord[],
    colour: PieceColour,
    declaredRating?: number
): number | undefined {
    const playerRecords = records.filter(
        record => record.colour == colour
    );

    const totalWeight = sumBy(
        playerRecords,
        record => phaseWeights[record.phase]
    );

    // Not enough evidence for a meaningful estimate
    if (totalWeight < 3) {
        return declaredRating
            && clamp(declaredRating, RATING_FLOOR, RATING_CEILING);
    }

    const weightedLoss = sumBy(
        playerRecords,
        record => record.centipawnLoss * phaseWeights[record.phase]
    ) / totalWeight;

    const accuracyRecords = playerRecords.filter(
        record => record.accuracy != undefined
    );

    const accuracyWeight = sumBy(
        accuracyRecords,
        record => phaseWeights[record.phase]
    );

    const weightedAccuracy = accuracyWeight > 0
        ? sumBy(
            accuracyRecords,
            record => record.accuracy! * phaseWeights[record.phase]
        ) / accuracyWeight
        : undefined;

    // Penalise the rate of errors per weighted move
    const errorPenalty = Math.min(700,
        sumBy(playerRecords, record => (
            (
                record.classification
                && errorPenaltyWeights[record.classification]
            ) || 0
        ) * phaseWeights[record.phase]) / totalWeight
    );

    const lossRating = getRatingFromCentipawnLoss(weightedLoss);

    const performanceRating = weightedAccuracy != undefined
        ? 0.55 * lossRating + 0.45 * getRatingFromAccuracy(weightedAccuracy)
        : lossRating;

    let estimate = performanceRating - errorPenalty;

    // Use the declared rating as an anchor; a single game is a small
    // sample, so never stray absurdly far from it
    if (declaredRating) {
        const anchor = clamp(declaredRating, RATING_FLOOR, RATING_CEILING);

        estimate = 0.75 * estimate + 0.25 * anchor;
        estimate = clamp(estimate, anchor - 500, anchor + 500);
    }

    return round(
        clamp(estimate, RATING_FLOOR, RATING_CEILING) / 10
    ) * 10;
}

export function estimateGameRatings(
    records: RatedMoveRecord[],
    declaredRatings?: DeclaredRatings
) {
    const white = estimatePlayerRating(
        records, PieceColour.WHITE, declaredRatings?.white
    );

    const black = estimatePlayerRating(
        records, PieceColour.BLACK, declaredRatings?.black
    );

    if (white == undefined || black == undefined) return undefined;

    return { white, black };
}
