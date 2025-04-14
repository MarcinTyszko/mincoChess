import { CSSProperties } from "react";

import { PlayerProfile } from "wintrchess";

interface AnalysisBoardProps {
    topProfile: PlayerProfile;
    bottomProfile: PlayerProfile;
    style?: CSSProperties;
}

export default AnalysisBoardProps;