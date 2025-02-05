import React, { useEffect, useState } from "react";

import useEvents from "@hooks/useEvents";
import EventType from "@constants/EventType";

import generateTreeView from "./treeParser";
import MoveClickEventContext from "./MoveClickEventContext";
import StateTreeEditorProps from "./StateTreeEditorProps";

function StateTreeEditor({
    style,
    stateTreeRootNode,
    onMoveClick
}: StateTreeEditorProps) {
    const { subscribeEventListener } = useEvents();

    const [ treeView, setTreeView ] = useState(
        generateTreeView(stateTreeRootNode)
    );

    useEffect(() => {
        subscribeEventListener(EventType.STATE_TREE_UPDATE, () => {
            setTreeView(
                generateTreeView(stateTreeRootNode)
            );
        });
    }, []);

    return <div style={style}>
        <MoveClickEventContext.Provider value={onMoveClick}>
            {treeView}
        </MoveClickEventContext.Provider>
    </div>;
}

export default StateTreeEditor;