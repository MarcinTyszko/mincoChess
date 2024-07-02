const GameSource = {
    PGN: {
        key: "pgn",
        title: "PGN",
        expandField: true,
        requiresSearch: false
    },
    FEN: {
        key: "fen",
        title: "FEN",
        expandField: false,
        requiresSearch: false
    },
    CHESS_COM: {
        key: "chessCom",
        title: "Chess.com",
        expandField: false,
        requiresSearch: true
    },
    LICHESS: {
        key: "lichess",
        title: "Lichess",
        expandField: false,
        requiresSearch: true
    },
    CHESSKID: {
        key: "chessKid",
        title: "ChessKid",
        expandField: false,
        requiresSearch: true
    }
};

type GameSource = Readonly<typeof GameSource.PGN>;

export default GameSource;