import React, { useContext } from "react";
import { round } from "lodash";

import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import AnalysisProgressContext from "../AnalysisProgressContext";
import StateTreeEditor from "@components/analysis/StateTreeEditor";
import playBoardSound from "@lib/boardSounds";

import * as styles from "./GameReport.module.css";

function GameReport() {
    const { analysisGame } = useAnalysisGameStore();

    const {
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const { analysisProgress } = useContext(AnalysisProgressContext);
    
    return <>
        <span style={{ color: "white" }}>
            PROGRESS: {round(analysisProgress * 100, 1)}%
        </span>

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

export default GameReport;