import { GameSource } from "wintrchess";

type GameSourcesType = { [key: string]: GameSource };

const gameSources: GameSourcesType = {
    pgn: {
        key: "pgn",
        title: "PGN",
        expandField: true
    },
    fen: {
        key: "fen",
        title: "FEN",
        expandField: false
    },
    chessCom: {
        key: "chessCom",
        title: "Chess.com",
        expandField: false
    },
    lichess: {
        key: "lichess",
        title: "Lichess",
        expandField: false
    },
    chessKid: {
        key: "chessKid",
        title: "ChessKid",
        expandField: false
    }
};

export default gameSources;