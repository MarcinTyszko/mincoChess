import React from "react";

import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import EngineLines from "@components/analysis/EngineLines";
import StateTreeEditor from "@components/analysis/StateTreeEditor";
import { getSettings } from "@lib/settings";
import playBoardSound from "@lib/boardSounds";

import ProgressArea from "./ProgressArea";
import * as styles from "./GameReport.module.css";

function GameReport() {
    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const settings = getSettings();
    
    return <>
        <ProgressArea/>

        {
            settings.analysis.engineLines > 0
            && <EngineLines fen={currentStateTreeNode.state.fen} />
        }

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