import React, { useContext } from "react";

import MoveClickEventContext from "../../MoveClickEventContext";
import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";
import useAnalysisGameStore from "@stores/AnalysisGameStore";

function Move({ stateTreeNode, children }: MoveProps) {
    const onMoveClick = useContext(MoveClickEventContext);

    const { currentStateTreeNode } = useAnalysisGameStore();

    return <span
        className={
            styles.wrapper
            + ` ${currentStateTreeNode == stateTreeNode && styles.current}`
        }
        onClick={() => {
            if (stateTreeNode) onMoveClick?.(stateTreeNode);
        }}
    >
        {stateTreeNode?.state.move?.san || children || "?"}
    </span>;
}

export default Move;