import { StateTreeNode } from "wintrchess";

interface LineGroupProps {
    indentCount: number;
    nodes: (StateTreeNode | null)[];
    initialPosition?: string;
    forceWhiteMoveNumber?: boolean;
}

export default LineGroupProps;