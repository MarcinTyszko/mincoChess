// Note:
// Game result values concur with Chess.com's API
// Values need to be adapted to comply with other services

enum GameResult {
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
    ABANDONED = "abandoned"
}

export default GameResult;