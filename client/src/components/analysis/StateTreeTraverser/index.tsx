import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";

import { getNodeChain } from "wintrchess";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import playBoardSound from "@lib/boardSounds";

import StateTreeTraverserProps from "./StateTreeTraverserProps";
import * as styles from "./StateTreeTraverser.module.css";

function StateTreeTraverser({ style }: StateTreeTraverserProps) {
    const { t } = useTranslation();

    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        autoplayEnabled,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

    useEffect(() => {
        if (autoplayEnabled) {
            traverseForwards();

            autoplayIntervalRef.current = setInterval(traverseForwards, 1000);
        } else {
            clearInterval(autoplayIntervalRef.current);
        }
    }, [autoplayEnabled]);

    function traverseToBeginning() {
        setCurrentStateTreeNode(analysisGame.stateTree);

        setAutoplayEnabled(false);
    }

    function traverseToEnd() {
        const finalNode = getNodeChain(analysisGame.stateTree).at(-1)
            || analysisGame.stateTree;

        setCurrentStateTreeNode(finalNode);

        playBoardSound(finalNode);

        setAutoplayEnabled(false);
    }

    function traverseBackwards() {
        setCurrentStateTreeNode(
            currentStateTreeNode.parent || analysisGame.stateTree
        );

        playBoardSound(currentStateTreeNode);

        setAutoplayEnabled(false);
    }

    function traverseForwards() {
        setCurrentStateTreeNode(currentNode => {
            const priorityChild = currentNode.children.at(0);

            if (priorityChild) {
                playBoardSound(priorityChild);

                return priorityChild;
            } else {
                setAutoplayEnabled(false);

                return currentNode;
            }
        });
    }

    useHotkeys("up, shift+left", traverseToBeginning);
    useHotkeys("down, shift+right", traverseToEnd);
    useHotkeys("left", traverseBackwards);
    useHotkeys("right", traverseForwards);

    return <div className={styles.wrapper} style={style}>
        <img
            src={require("@assets/img/start.svg")}
            width={50}
            onClick={traverseToBeginning}
            title={t("pages.analysis.stateTreeTraverser.beginning")}
        />

        <img
            src={require("@assets/img/back.svg")}
            width={50}
            onClick={traverseBackwards}
            title={t("pages.analysis.stateTreeTraverser.back")}
        />

        <div
            className={styles.autoplayContainer}
            onClick={() => setAutoplayEnabled(!autoplayEnabled)}
            title={autoplayEnabled
                ? t("pages.analysis.stateTreeTraverser.pause")
                : t("pages.analysis.stateTreeTraverser.play")
            }
        >
            {
                autoplayEnabled
                    ? <img src={require("@assets/img/pause.svg")} width={50} />
                    : <img src={require("@assets/img/play.svg")} width={50} />
            }
        </div>

        <img
            src={require("@assets/img/next.svg")}
            width={50}
            onClick={traverseForwards}
            title={t("pages.analysis.stateTreeTraverser.next")}
        />

        <img
            src={require("@assets/img/end.svg")}
            width={50}
            onClick={traverseToEnd}
            title={t("pages.analysis.stateTreeTraverser.end")}
        />
    </div>;
}

export default StateTreeTraverser;