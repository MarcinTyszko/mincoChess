import { StateTreeNode } from "wintrchess";

interface LineGroupProps {
    indentCount: number;
    nodes: (StateTreeNode | null)[];
    forceWhiteMoveNumber?: boolean;
}

export default LineGroupProps;