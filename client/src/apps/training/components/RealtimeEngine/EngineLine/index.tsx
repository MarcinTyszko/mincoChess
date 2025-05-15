import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import playBoardSound from "@lib/boardSounds";

import * as styles from "./EngineLine.module.css";
import EngineLineProps from "./EngineLineProps";
import { addChildMove } from "wintrchess";

function EngineLine({ line }: EngineLineProps) {
    const { t } = useTranslation();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore();

    const [ expanded, setExpanded ] = useState(false);

    const engineLineRef = useRef<HTMLDivElement>(null);

    useEffect(
        () => setExpanded(false),
        [currentStateTreeNode]
    );

    function traverseToLineMove(targetIndex: number) {
        let currentNode = currentStateTreeNode;

        for (let moveIndex = 0; moveIndex <= targetIndex; moveIndex++) {
            currentNode = addChildMove(currentNode, line.moves[moveIndex].san);
        }

        setCurrentStateTreeNode(currentNode);

        playBoardSound(currentNode);
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
                    ? Math.abs(line.evaluation.value / 100).toFixed(2)
                    : (
                        line.evaluation.value == 0
                            ? t("pages.analysis.realtimeEngine.checkmate")
                            : `M${Math.abs(line.evaluation.value)}`
                    )
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

        <div className={styles.expandArrowContainer}>
            <img
                className={styles.expandArrow}
                src={require("@assets/img/interface/expandarrow.svg")}
                width={20}
                onClick={() => setExpanded(!expanded)}
                style={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
                }}
            />
        </div>
    </div>;
}

export default EngineLine;