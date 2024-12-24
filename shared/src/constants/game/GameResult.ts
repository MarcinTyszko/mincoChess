import GenericGameResult from "./GenericGameResult";
import PieceColour from "../PieceColour";

// Note:
// Game result values concur with Chess.com's API
// Values need to be adapted to comply with other services

export enum GameResult {
    WIN = "win",
    CHECKMATED = "checkmated",
    AGREED = "agreed",
    REPETITION = "repetition",
    TIMEOUT	= "timeout",
    RESIGNED = "resigned",
    STALEMATE = "stalemate",
    LOSE = "lose",
    INSUFFICIENT_MATERIAL = "insufficient",
    FIFTY_MOVE = "50move",
    ABANDONED = "abandoned",
    UNKNOWN = "unknown"
}

export function getOpinionatedGameResult(
    whiteResult: GenericGameResult,
    perspective: PieceColour
) {
    if (perspective == PieceColour.BLACK) {
        return {
            [GenericGameResult.WIN]: GenericGameResult.LOSE,
            [GenericGameResult.DRAW]: GenericGameResult.DRAW,
            [GenericGameResult.LOSE]: GenericGameResult.WIN,
            [GenericGameResult.UNKNOWN]: GenericGameResult.UNKNOWN
        }[whiteResult];
    }

    return whiteResult;
}

export default GameResult;