import React, { useState, useRef } from "react";

import useAnalysisBoardStore from "@stores/AnalysisBoardStore";

import * as styles from "./EngineLine.module.css";
import EngineLineProps from "./EngineLineProps";

function EngineLine({ line }: EngineLineProps) {
    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore();

    const [ expanded, setExpanded ] = useState(false);

    const engineLineRef = useRef<HTMLDivElement>(null);

    function traverseToLineMove(targetIndex: number) {
        let currentNode = currentStateTreeNode;

        for (let moveIndex = 0; moveIndex <= targetIndex; moveIndex++) {
            currentNode = currentNode.addChildMove(
                line.moves[moveIndex].san
            );
        }

        setCurrentStateTreeNode(currentNode);
    }

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
            line.moves.map((move, index) => (
                <span
                    className={styles.lineMove}
                    onClick={() => traverseToLineMove(index)}
                >
                    {move.san}
                </span>
            ))
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