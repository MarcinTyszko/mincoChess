import React from "react";
import { clamp } from "lodash";

import EvaluationBarProps from "./EvaluationBarProps";
import * as styles from "./EvaluationBar.module.css";
import { PieceColour } from "wintrchess";

const width = 40;

function EvaluationBar({
    height,
    evaluation,
    moveColour,
    flipped
}: EvaluationBarProps) {
    let blackHeight: number;

    if (evaluation.type == "centipawn") {
        blackHeight = clamp(
            (height / 2) - (evaluation.value * (0.5 - (1 / 16))),
            height / 16,
            height - (height / 16)
        );
    } else {
        if (evaluation.value == 0) {
            blackHeight = moveColour == PieceColour.WHITE
                ? 0
                : height;
        } else {
            blackHeight = evaluation.value > 0
                ? 0
                : height;
        }
    }

    const textY = blackHeight > (height / 2) == flipped
        ? height - 12 : 20;

    const textColour = blackHeight > (height / 2) == flipped
        ? "#000" : "#fff";

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
                y={textY}
                fontSize={14}
                fill={textColour}
                style={{
                    fontFamily: "sans-serif"
                }}
            >
                {
                    evaluation.type == "mate"
                        ? `M${Math.abs(evaluation.value)}`
                        : (Math.abs(evaluation.value) / 100).toFixed(
                            evaluation.value >= 1000 ? 0 : 1
                        )
                }
            </text>
        </svg>
    </div>;
}

export default EvaluationBar;