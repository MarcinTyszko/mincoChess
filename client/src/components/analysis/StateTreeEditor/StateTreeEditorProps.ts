import { CSSProperties } from "react";

import { StateTreeNode } from "wintrchess";

interface StateTreeEditorProps {
    style?: CSSProperties;
    stateTreeRootNode: StateTreeNode;
}

export default StateTreeEditorProps;