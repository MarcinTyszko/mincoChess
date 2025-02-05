import React, { useEffect, useState } from "react";

import useEvents from "@hooks/useEvents";
import EventType from "@constants/EventType";

import generateTreeView from "./treeParser";
import StateTreeEditorProps from "./StateTreeEditorProps";

function StateTreeEditor({
    style,
    stateTreeRootNode
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
        {treeView}
    </div>;
}

export default StateTreeEditor;