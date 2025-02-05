import { ReactNode } from "react";

import { StateTreeNode } from "wintrchess";

interface MoveProps {
    stateTreeNode?: StateTreeNode;
    children?: ReactNode;
}

export default MoveProps;