import React from "react";

import playBoardSound from "@lib/boardSounds";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import StateTreeEditor from "@apps/training/components/StateTreeEditor";

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