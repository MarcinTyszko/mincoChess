import React from "react";
import { clamp } from "lodash";

import EvaluationBarProps from "./EvaluationBarProps";
import * as styles from "./EvaluationBar.module.css";

function EvaluationBar({ height, evaluation, flipped }: EvaluationBarProps) {
    let blackHeight: number;

    if (evaluation.type == "centipawn") {
        blackHeight = clamp(
            (height / 2) - (evaluation.value * (0.5 - (1 / 16))),
            height / 16,
            height - (height / 16)
        );
    } else {
        blackHeight = evaluation.value > 0
            ? 0
            : height;
    }

    return <div
        className={styles.evaluationBar}
        style={{
            height: height,
            backgroundColor: flipped ? "#0c0c0c" : "#fff"
        }}
    >
        <svg viewBox={`0 0 40 ${height}`}>
            <rect
                className={styles.overBar}
                fill={flipped ? "#fff" : "#0c0c0c"}
                x={0}
                y={0}
                width={40}
                height={flipped ? (height - blackHeight) : blackHeight}
            />
        </svg>
    </div>;
}

export default EvaluationBar;