import React from "react";

import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";

function Move({ state, onClick, children }: MoveProps) {
    return <span
        className={styles.wrapper}
        onClick={() => {
            if (state) onClick?.(state);
        }}
    >
        {state?.move?.san || children || "?"}
    </span>;
}

export default Move;