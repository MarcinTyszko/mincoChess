import { Game, PieceColour } from "wintrchess";

interface GameListingProps {
    game: Game;
    perspective: PieceColour;
    onClick?: (game: Game) => void;
}

export default GameListingProps;