import React, { useRef, useState } from "react";

import useAnalysisGameStore from "@stores/AnalysisGameStore";

import StateTreeTraverserProps from "./StateTreeTraverserProps";
import * as styles from "./StateTreeTraverser.module.css";

function StateTreeTraverser({ style }: StateTreeTraverserProps) {
    const {
        analysisGame,
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisGameStore();

    const [ isPlaying, setIsPlaying ] = useState(false);

    const playIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

    function traverseToBeginning() {
        if (!analysisGame) return;

        setCurrentStateTreeNode(analysisGame.stateTree);

        if (isPlaying) toggleAutoplay();
    }

    function traverseToEnd() {
        if (!analysisGame) return;

        setCurrentStateTreeNode(
            analysisGame?.stateTree.finalNode()
        );

        if (isPlaying) toggleAutoplay();
    }

    function traverseBackwards() {
        if (!analysisGame) return;

        setCurrentStateTreeNode(
            currentStateTreeNode.parent || analysisGame?.stateTree
        );

        if (isPlaying) toggleAutoplay();
    }

    function traverseForwards() {
        const priorityChild = currentStateTreeNode.priorityChild();

        if (priorityChild) {
            setCurrentStateTreeNode(priorityChild);

            if (isPlaying) toggleAutoplay();
        }
    }

    function toggleAutoplay() {
        const autoplayStatus = !isPlaying;

        setIsPlaying(autoplayStatus);

        if (autoplayStatus) {
            function nextNode() {
                setCurrentStateTreeNode(node => {
                    const priorityChild = node?.priorityChild();

                    if (priorityChild) {
                        return priorityChild;
                    } else {
                        clearInterval(playIntervalRef.current);
                        setIsPlaying(false);

                        return node;
                    }
                });
            }

            nextNode();

            playIntervalRef.current = setInterval(nextNode, 1000);
        } else {
            clearInterval(playIntervalRef.current);
        }
    }

    return <div className={styles.wrapper} style={style}>
        <img
            src={require("@assets/img/start.svg")}
            width={50}
            onClick={traverseToBeginning}
        />

        <img
            src={require("@assets/img/back.svg")}
            width={50}
            onClick={traverseBackwards}
        />

        <div
            className={styles.autoplayContainer}
            onClick={toggleAutoplay}
        >
            {
                isPlaying
                    ? <img src={require("@assets/img/pause.svg")} width={50} />
                    : <img src={require("@assets/img/play.svg")} width={50} />
            }
        </div>

        <img
            src={require("@assets/img/next.svg")}
            width={50}
            onClick={traverseForwards}
        />

        <img
            src={require("@assets/img/end.svg")}
            width={50}
            onClick={traverseToEnd}
        />
    </div>;
}

export default StateTreeTraverser;