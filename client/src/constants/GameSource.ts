export enum GameSelectorButton {
    SEARCH_GAMES,
    UPLOAD_FILE
}

type GameSourceType = "PGN"
    | "FEN"
    | "CHESS_COM"
    | "LICHESS";

export interface GameSourceData {
    key: string;
    title: string;
    expandField: boolean;
    selectorButton?: GameSelectorButton;
}

export const GameSource: Record<GameSourceType, GameSourceData> = {
    PGN: {
        key: "pgn",
        title: "PGN",
        expandField: true,
        selectorButton: GameSelectorButton.UPLOAD_FILE
    },
    FEN: {
        key: "fen",
        title: "FEN",
        expandField: false
    },
    CHESS_COM: {
        key: "chessCom",
        title: "Chess.com",
        expandField: false,
        selectorButton: GameSelectorButton.SEARCH_GAMES
    },
    LICHESS: {
        key: "lichess",
        title: "Lichess",
        expandField: false,
        selectorButton: GameSelectorButton.SEARCH_GAMES
    }
};