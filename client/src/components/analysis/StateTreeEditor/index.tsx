import React from "react";

import generateTreeView from "./treeParser";
import MoveClickEventContext from "./MoveClickEventContext";
import StateTreeEditorProps from "./StateTreeEditorProps";

function StateTreeEditor({
    className,
    style,
    stateTreeRootNode,
    onMoveClick
}: StateTreeEditorProps) {
    return <div className={className} style={style}>
        <MoveClickEventContext.Provider value={onMoveClick}>
            {generateTreeView(stateTreeRootNode)}
        </MoveClickEventContext.Provider>
    </div>;
}

export default StateTreeEditor;