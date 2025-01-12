import { CSSProperties } from "react";

import { PlayerProfile } from "wintrchess";

interface ChessBoardProps {
    topProfile?: PlayerProfile;
    bottomProfile?: PlayerProfile;
    style?: CSSProperties;
}

export default ChessBoardProps;