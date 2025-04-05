import React from "react";
import { useShallow } from "zustand/react/shallow";

import playBoardSound from "@lib/boardSounds";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/analysis/AnalysisGameStore";
import StateTreeEditor from "@components/analysis/StateTreeEditor";

import * as styles from "./GameAnalysis.module.css";

function GameAnalysis() {
    const { analysisGame } = useAnalysisGameStore();

    const {
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore(
        useShallow(state => ({
            setCurrentStateTreeNode: state.setCurrentStateTreeNode,
            setAutoplayEnabled: state.setAutoplayEnabled
        }))
    );
    
    return <>
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