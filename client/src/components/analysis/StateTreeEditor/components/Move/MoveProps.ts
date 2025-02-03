import { ReactNode } from "react";

import { BoardState } from "wintrchess";

interface MoveProps {
    state?: BoardState;
    onClick?: (state: BoardState) => void;
    children?: ReactNode;
}

export default MoveProps;