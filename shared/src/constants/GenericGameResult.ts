import GameResult from "./GameResult";

export enum GenericGameResult {
    WIN = "win",
    DRAW = "draw",
    LOSE = "lose"
}

export function getGenericGameResult(result: GameResult) {
    switch (result) {
        case GameResult.ABANDONED:
            return GenericGameResult.LOSE;
        case GameResult.AGREED:
            return GenericGameResult.DRAW;
        case GameResult.CHECKMATED:
            return GenericGameResult.LOSE;
        case GameResult.FIFTY_MOVE:
            return GenericGameResult.DRAW;
        case GameResult.INSUFFICIENT_MATERIAL:
            return GenericGameResult.DRAW;
        case GameResult.LOSE:
            return GenericGameResult.LOSE;
        case GameResult.REPETITION:
            return GenericGameResult.DRAW;
        case GameResult.RESIGNED:
            return GenericGameResult.LOSE;
        case GameResult.STALEMATE:
            return GenericGameResult.DRAW;
        case GameResult.TIMEOUT:
            return GenericGameResult.LOSE;
        case GameResult.WIN:
            return GenericGameResult.WIN;
    }
}