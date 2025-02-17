import { PieceColour, PlayerProfile } from "wintrchess";

interface PlayerProfileProps {
    profile: PlayerProfile;
    colour: PieceColour;
    bottom?: boolean;
}

export default PlayerProfileProps;