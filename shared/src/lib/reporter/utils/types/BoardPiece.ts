import { Square, PieceSymbol, Color } from "chess.js";

interface BoardPiece {
    square: Square;
    type: PieceSymbol;
    color: Color;
}

export default BoardPiece;