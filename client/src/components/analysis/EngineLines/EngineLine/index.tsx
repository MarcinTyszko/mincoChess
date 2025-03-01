import React, { useState, useRef } from "react";

import * as styles from "./EngineLine.module.css";
import EngineLineProps from "./EngineLineProps";

function EngineLine({ line }: EngineLineProps) {
    const [ expanded, setExpanded ] = useState(false);

    const engineLineRef = useRef<HTMLDivElement>(null);

    return <div
        className={styles.engineLine}
        style={{
            height: expanded ? engineLineRef.current?.scrollHeight : "25px"
        }}
        ref={engineLineRef}
    >
        <span
            className={styles.evaluation}
            style={{
                backgroundColor: line.evaluation.value >= 0
                    ? "#fff" : "#0c0c0c",
                color: line.evaluation.value >= 0
                    ? "#0c0c0c" : "#fff"
            }}
        >
            {
                line.evaluation.type == "centipawn"
                    ? Math.abs(line.evaluation.value / 100).toFixed(1)
                    : `M${Math.abs(line.evaluation.value)}`
            }
        </span>

        {
            line.moves.slice(0, 12).map(move => <span>
                {move.san}
            </span>)
        }

        <img
            className={styles.expandArrow}
            src={
                expanded
                    ? require("@assets/img/expandarrow.svg")
                    : require("@assets/img/collapsearrow.svg")
            }
            width={20}
            onClick={() => setExpanded(!expanded)}
        />
    </div>;
}

export default EngineLine;