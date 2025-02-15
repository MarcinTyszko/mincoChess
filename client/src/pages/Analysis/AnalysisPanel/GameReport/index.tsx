import React, { useContext } from "react";
import { round } from "lodash";

import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import AnalysisProgressContext from "../AnalysisProgressContext";
import StateTreeEditor from "@components/analysis/StateTreeEditor";
import StateTreeTraverser from "@components/analysis/StateTreeTraverser";
import Breakpoints from "@constants/Breakpoints";
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

        <StateTreeTraverser
            style={{
                position: "fixed",
                bottom: "10px",
                right: innerWidth > Breakpoints.MOBILE_LAYOUT
                    ? "10px"
                    : `calc(50vw - (${innerWidth > 400 ? 365 : 280}px / 2))`
            }}
        />

        <div className={styles.stateTreeTraverserPlaceholder} />
    </>;
}

export default GameReport;