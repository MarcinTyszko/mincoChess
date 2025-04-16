import { Color } from "chess.js";

import PieceColour from "@constants/PieceColour";

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
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci.charAt(4) || undefined
    };
}

export function adaptPieceColour(
    colour: PieceColour
): Color {
    return colour == PieceColour.WHITE ? "w" : "b";
}

export function flipPieceColour(colour: PieceColour) {
    return colour == PieceColour.WHITE
        ? PieceColour.BLACK : PieceColour.WHITE;
}

export function flipAdaptedPieceColour(colour: Color) {
    return colour == "w" ? "b" : "w";
}