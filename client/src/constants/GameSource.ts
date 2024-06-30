import { GameSource } from "wintrchess";

type GameSourcesType = { [key: string]: GameSource };

const gameSources: GameSourcesType = {
    pgn: {
        key: "pgn",
        title: "PGN",
        expandField: true,
        requiresSearch: false
    },
    fen: {
        key: "fen",
        title: "FEN",
        expandField: false,
        requiresSearch: false
    },
    chessCom: {
        key: "chessCom",
        title: "Chess.com",
        expandField: false,
        requiresSearch: true
    },
    lichess: {
        key: "lichess",
        title: "Lichess",
        expandField: false,
        requiresSearch: true
    },
    chessKid: {
        key: "chessKid",
        title: "ChessKid",
        expandField: false,
        requiresSearch: true
    }
};

export default gameSources;