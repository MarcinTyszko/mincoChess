import { Color, Square, WHITE, BLACK } from "chess.js";

import PieceColour from "@constants/PieceColour";

export function parseFen(fen: string) {
    const fenParts = fen.split(" ");

    const turnColour = fenParts[1] == "w"
        ? PieceColour.WHITE : PieceColour.BLACK;

    const castlingRights = fenParts[2];

    return {
        parts: fenParts,
        turnColour,
        castlingRights: {
            kingside: {
                white: castlingRights.includes("K"),
                black: castlingRights.includes("k")
            },
            queenside: {
                white: castlingRights.includes("Q"),
                black: castlingRights.includes("q")
            }
        },
        enPassantSquare: fenParts[3] == "-" ? undefined : fenParts[3],
        fiftyMoveClock: parseInt(fenParts[4]),
        fullMoveCount: parseInt(fenParts[5])
    };
}

export function setFenTurn(fen: string, colour: PieceColour) {
    const parsedFen = parseFen(fen);

    // If turn colour changed, clear en passant square
    if (parsedFen.parts[1] != colour) {
        parsedFen.parts[3] = "-";
    }

    // Update turn colour
    parsedFen.parts[1] = adaptPieceColour(colour);

    return parsedFen.parts.join(" ");
}

export function parseSanMove(san: string) {
    return {
        castling: san.includes("O"),
        check: san.includes("+"),
        capture: san.includes("x"),
        promotion: san.includes("="),
        checkmate: san.includes("#"),
        piece: san.charAt(0)
    };
}

export function parseUciMove(uci: string) {
    return {
        from: uci.slice(0, 2) as Square,
        to: uci.slice(2, 4) as Square,
        promotion: uci.charAt(4) || undefined
    };
}

export function adaptPieceColour(colour: PieceColour): Color;
export function adaptPieceColour(colour: Color): PieceColour;

export function adaptPieceColour(colour: PieceColour | Color) {
    switch (colour) {
        case WHITE:
            return PieceColour.WHITE;
        case BLACK:
            return PieceColour.BLACK;
        case PieceColour.WHITE:
            return WHITE;
        case PieceColour.BLACK:
            return BLACK;
    }
}

export function flipPieceColour(color: Color): Color;
export function flipPieceColour(color: PieceColour): PieceColour;

export function flipPieceColour(colour: PieceColour | Color) {
    switch (colour) {
        case PieceColour.WHITE:
            return PieceColour.BLACK;
        case PieceColour.BLACK:
            return PieceColour.WHITE;
        case WHITE:
            return BLACK;
        case BLACK:
            return WHITE;
    }
}