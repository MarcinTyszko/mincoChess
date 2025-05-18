import React from "react";

import playBoardSound from "@apps/analysis/components/AnalysisBoard/boardSounds";
import useAnalysisBoardStore from "@apps/analysis/stores/AnalysisBoardStore";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import StateTreeEditor from "@apps/analysis/components/StateTreeEditor";

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