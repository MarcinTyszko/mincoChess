import { CSSProperties } from "react";
import { Arrow } from "react-chessboard/dist/chessboard/types";
import { Move } from "chess.js";

import { StateTreeNode, PlayerProfile, Evaluation } from "wintrchess";

interface BoardProps {
    className?: string;
    style?: CSSProperties;
    profileClassName?: string;
    profileStyle?: CSSProperties;
    whiteProfile?: PlayerProfile;
    blackProfile?: PlayerProfile;
    node?: StateTreeNode;
    flipped?: boolean;
    evaluation?: Evaluation;
    arrows?: Arrow[];
    theme?: {
        lightSquareColour?: string;
        darkSquareColour?: string;
        pieceSet?: string;
    };
    piecesDraggable?: boolean;
    enableClassifications?: boolean;

    onAddMove?: (move: Move) => boolean;
}

export default BoardProps;