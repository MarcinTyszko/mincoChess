import GameResult from "./GameResult";

export enum GenericGameResult {
    WIN = "win",
    DRAW = "draw",
    LOSE = "lose"
}

export function getGenericGameResult(result: GameResult) {
    return {
        [GameResult.ABANDONED]: GenericGameResult.LOSE,
        [GameResult.AGREED]: GenericGameResult.DRAW,
        [GameResult.CHECKMATED]: GenericGameResult.LOSE,
        [GameResult.FIFTY_MOVE]: GenericGameResult.DRAW,
        [GameResult.INSUFFICIENT_MATERIAL]: GenericGameResult.DRAW,
        [GameResult.LOSE]: GenericGameResult.LOSE,
        [GameResult.REPETITION]: GenericGameResult.DRAW,
        [GameResult.RESIGNED]: GenericGameResult.LOSE,
        [GameResult.STALEMATE]: GenericGameResult.DRAW,
        [GameResult.TIMEOUT]: GenericGameResult.LOSE,
        [GameResult.WIN]: GenericGameResult.WIN
    }[result];
}