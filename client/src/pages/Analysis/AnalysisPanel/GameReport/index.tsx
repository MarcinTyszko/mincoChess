import React from "react";

import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import EngineLines from "@components/analysis/EngineLines";
import StateTreeEditor from "@components/analysis/StateTreeEditor";
import playBoardSound from "@lib/boardSounds";

import ProgressArea from "./ProgressArea";
import * as styles from "./GameReport.module.css";

function GameReport() {
    const { settings } = useSettingsStore();

    const { analysisGame } = useAnalysisGameStore();

    const {
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore();
    
    return <>
        <ProgressArea/>

        {
            settings.analysis.engineLines > 0
            && <EngineLines/>
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