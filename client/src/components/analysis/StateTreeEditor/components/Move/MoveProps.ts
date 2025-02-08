import { ReactNode } from "react";

import { StateTreeNode } from "wintrchess";

interface MoveProps {
    node?: StateTreeNode;
    children?: ReactNode;
}

export default MoveProps;