import { CSSProperties } from "react";

import { StateTreeNode } from "wintrchess";

interface StateTreeEditorProps {
    className?: string;
    style?: CSSProperties;
    stateTreeRootNode: StateTreeNode;
    onMoveClick?: (node: StateTreeNode) => void;
}

export default StateTreeEditorProps;