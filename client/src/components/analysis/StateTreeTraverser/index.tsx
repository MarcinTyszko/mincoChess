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
        setCurrentStateTreeNode(analysisGame.stateTree);
        setAutoplay(false);
    }

    function traverseToEnd() {
        setCurrentStateTreeNode(
            analysisGame.stateTree.finalNode()
        );
        setAutoplay(false);
    }

    function traverseBackwards() {
        setCurrentStateTreeNode(
            currentStateTreeNode.parent || analysisGame.stateTree
        );
        setAutoplay(false);
    }

    function traverseForwards() {
        setCurrentStateTreeNode(currentNode => {
            const priorityChild = currentNode.children.at(0);

            if (priorityChild) {
                return priorityChild;
            } else {
                setAutoplay(false);

                return currentNode;
            }
        });
    }

    function setAutoplay(status: boolean) {
        setIsPlaying(status);

        if (status) {
            traverseForwards();

            playIntervalRef.current = setInterval(traverseForwards, 1000);
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
            onClick={() => setAutoplay(!isPlaying)}
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