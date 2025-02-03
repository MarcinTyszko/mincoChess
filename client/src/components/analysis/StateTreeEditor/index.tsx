import React, { useMemo, useState } from "react";

import generateTreeView from "./treeParser";
import StateTreeEditorProps from "./StateTreeEditorProps";

function StateTreeEditor({
    style,
    stateTreeRootNode
}: StateTreeEditorProps) {
    const [ treeViewStale, setTreeViewStale ] = useState(false);

    const treeView = useMemo(
        () => generateTreeView(stateTreeRootNode),
        [treeViewStale]
    );

    return <div style={style}>
        {treeView}
    </div>;
}

export default StateTreeEditor;