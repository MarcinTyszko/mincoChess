const GameSource = {
    PGN: {
        key: "pgn",
        title: "PGN",
        expandField: true,
        requiresSearch: false,
        ratelimited: false
    },
    FEN: {
        key: "fen",
        title: "FEN",
        expandField: false,
        requiresSearch: false,
        ratelimited: false
    },
    CHESS_COM: {
        key: "chessCom",
        title: "Chess.com",
        expandField: false,
        requiresSearch: true,
        ratelimited: false
    },
    LICHESS: {
        key: "lichess",
        title: "Lichess",
        expandField: false,
        requiresSearch: true,
        ratelimited: true
    }
};

type GameSource = Readonly<typeof GameSource.PGN>;

export default GameSource;