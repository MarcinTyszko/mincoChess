import { Game } from "wintrchess";

interface GameListingProps {
    game: Game;
    onClick?: (game: Game) => void;
}

export default GameListingProps;