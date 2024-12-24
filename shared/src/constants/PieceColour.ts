export enum PieceColour {
    WHITE = "white",
    BLACK = "black"
}

export function oppositePieceColour(colour: PieceColour) {
    return colour == PieceColour.WHITE ? 
        PieceColour.BLACK 
        : PieceColour.WHITE;
}

export default PieceColour;