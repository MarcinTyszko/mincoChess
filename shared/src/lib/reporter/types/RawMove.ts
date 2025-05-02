import { Square, PieceSymbol, Color } from "chess.js";

interface RawMove {
    piece: PieceSymbol;
    color: Color;
    from: Square;
    to: Square;
    promotion?: PieceSymbol;
}

export default RawMove;