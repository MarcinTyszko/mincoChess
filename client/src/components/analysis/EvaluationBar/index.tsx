import React from "react";

import EvaluationBarProps from "./EvaluationBarProps";
import * as styles from "./EvaluationBar.module.css";

function EvaluationBar({ height, evaluation, flipped }: EvaluationBarProps) {
    return <div
        className={styles.evaluationBar}
        style={{ height }}
    >
        <svg viewBox={`0 0 40 ${height}`}>
            <rect
                className={styles.blackBar}
                x={0}
                y={0}
                width={40}
                height={height / 2}
            />
        </svg>
    </div>;
}

export default EvaluationBar;