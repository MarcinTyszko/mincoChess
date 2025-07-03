import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Options as HotkeyOptions, useHotkeys } from "react-hotkeys-hook";

import { getNodeChain } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import playBoardSound from "@/lib/boardSounds";

import StateTreeTraverserProps from "./StateTreeTraverserProps";
import * as styles from "./StateTreeTraverser.module.css";

type Interval = ReturnType<typeof setInterval>;

const hotkeyConfig: HotkeyOptions = { preventDefault: true };

function StateTreeTraverser({ className, style }: StateTreeTraverserProps) {
    const { t } = useTranslation();

    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        autoplayEnabled,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const autoplayIntervalRef = useRef<Interval>();

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
        if (!currentStateTreeNode.parent) return;

        setCurrentStateTreeNode(currentStateTreeNode.parent);
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

    useHotkeys("up, shift+left", traverseToBeginning, hotkeyConfig);
    useHotkeys("down, shift+right", traverseToEnd, hotkeyConfig);
    useHotkeys("left", traverseBackwards, hotkeyConfig);
    useHotkeys("right", traverseForwards, hotkeyConfig);

    return <div className={`${styles.wrapper} ${className}`} style={style}>
        <img
            src={require("@assets/img/interface/start.svg")}
            width={50}
            onClick={traverseToBeginning}
            title={t("pages.analysis.stateTreeTraverser.beginning")}
        />

        <img
            src={require("@assets/img/interface/back.svg")}
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
            <img width={50} src={autoplayEnabled
                ? require("@assets/img/interface/pause.svg")
                : require("@assets/img/interface/play.svg")
            }/>
        </div>

        <img
            src={require("@assets/img/interface/next.svg")}
            width={50}
            onClick={traverseForwards}
            title={t("pages.analysis.stateTreeTraverser.next")}
        />

        <img
            src={require("@assets/img/interface/end.svg")}
            width={50}
            onClick={traverseToEnd}
            title={t("pages.analysis.stateTreeTraverser.end")}
        />
    </div>;
}

export default StateTreeTraverser;