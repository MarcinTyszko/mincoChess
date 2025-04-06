import React from "react";

import playBoardSound from "@lib/boardSounds";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/analysis/AnalysisGameStore";
import StateTreeEditor from "@components/analysis/StateTreeEditor";

import * as styles from "./GameAnalysis.module.css";

function GameAnalysis() {
    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore();
    
    return <StateTreeEditor
        className={styles.stateTreeEditor}
        stateTreeRootNode={analysisGame.stateTree}
        onMoveClick={node => {
            setCurrentStateTreeNode(node);
        
            if (node != currentStateTreeNode) {
                playBoardSound(node);
            }

            setAutoplayEnabled(false);
        }}
    />;
}

export default GameAnalysis;