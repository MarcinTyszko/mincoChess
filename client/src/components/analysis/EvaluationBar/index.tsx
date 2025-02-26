import React from "react";
import { clamp, round } from "lodash";

import EvaluationBarProps from "./EvaluationBarProps";
import * as styles from "./EvaluationBar.module.css";

const width = 40;

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
        <svg viewBox={`0 0 ${width} ${height}`}>
            <rect
                className={styles.overBar}
                fill={flipped ? "#fff" : "#0c0c0c"}
                x={0}
                y={0}
                width={width}
                height={flipped ? (height - blackHeight) : blackHeight}
            />

            <text
                textAnchor="middle"
                x={20}
                y={
                    evaluation.value >= 0
                        ? height - 12
                        : 20
                }
                fontSize={14}
                fill={
                    evaluation.value >= 0
                        ? "#000"
                        : "#fff"
                }
                style={{
                    fontFamily: "sans-serif"
                }}
            >
                {
                    evaluation.type == "mate"
                        ? `M${Math.abs(evaluation.value)}`
                        : round(Math.abs(evaluation.value) / 100, 1)
                }
            </text>
        </svg>
    </div>;
}

export default EvaluationBar;