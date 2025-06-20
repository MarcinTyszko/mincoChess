import { PieceColour } from "shared/constants/PieceColour";

import Game from "shared/types/game/Game";

interface GameListingProps {
    game: Game;
    perspective?: PieceColour;
    onClick?: (game: Game) => void;
}

export default GameListingProps;