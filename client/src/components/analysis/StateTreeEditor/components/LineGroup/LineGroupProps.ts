import { ReactNode } from "react";

import { StateTreeNode } from "wintrchess";

interface LineGroupProps {
    node: StateTreeNode;
    forceWhiteMoveNumber?: boolean;
    children: ReactNode;
}

export default LineGroupProps;