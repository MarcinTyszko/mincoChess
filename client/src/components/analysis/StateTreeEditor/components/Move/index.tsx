import React, { useContext } from "react";

import MoveClickEventContext from "../../MoveClickEventContext";
import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";

function Move({ stateTreeNode, children }: MoveProps) {
    const onMoveClick = useContext(MoveClickEventContext);

    return <span
        className={styles.wrapper}
        onClick={() => {
            if (stateTreeNode) onMoveClick?.(stateTreeNode);
        }}
    >
        {stateTreeNode?.state.move?.san || children || "?"}
    </span>;
}

export default Move;