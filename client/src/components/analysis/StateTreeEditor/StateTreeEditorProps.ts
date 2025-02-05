import { CSSProperties } from "react";

import { StateTreeNode } from "wintrchess";

interface StateTreeEditorProps {
    style?: CSSProperties;
    stateTreeRootNode: StateTreeNode;
    onMoveClick?: (node: StateTreeNode) => void;
}

export default StateTreeEditorProps;