import React from "react";

import playBoardSound from "@lib/boardSounds";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import EngineLines from "@components/analysis/EngineLines";
import ClassifiedMoveCard from "@components/analysis/report/ClassifiedMoveCard";
import StateTreeEditor from "@components/analysis/StateTreeEditor";

import ProgressArea from "../ProgressArea";
import * as styles from "./GameAnalysis.module.css";

function GameAnalysis() {
    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore();
    
    return <>
        <ProgressArea/>

        <EngineLines/>

        <ClassifiedMoveCard node={currentStateTreeNode} />

        <StateTreeEditor
            className={styles.stateTreeEditor}
            stateTreeRootNode={analysisGame.stateTree}
            onMoveClick={node => {
                setCurrentStateTreeNode(node);

                playBoardSound(node);

                setAutoplayEnabled(false);
            }}
        />
    </>;
}

export default GameAnalysis;