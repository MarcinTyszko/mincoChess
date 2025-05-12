import React, { useEffect, useState } from "react";

import { Evaluation, defaultEvaluation } from "wintrchess";
import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@apps/training/stores/RealtimeEngineStore";
import EvaluationBar from "../../EvaluationBar";

function EvaluationBarArea() {
    const engineEnabled = useSettingsStore(
        state => state.settings.analysis.engineEnabled
    );

    const { analysisBoardWidth } = useLayoutStore();

    const {
        currentStateTreeNode,
        boardFlipped
    } = useAnalysisBoardStore();

    const { displayedEngineLines } = useRealtimeEngineStore();

    const [ evaluation, setEvaluation ] = useState<Evaluation>(defaultEvaluation);

    useEffect(() => {
        if (displayedEngineLines.length == 0) return;

        setEvaluation(
            displayedEngineLines.at(0)?.evaluation
            || defaultEvaluation
        );
    }, [displayedEngineLines]);

    return <EvaluationBar
        disabled={!engineEnabled}
        height={analysisBoardWidth}
        evaluation={evaluation}
        moveColour={currentStateTreeNode.state.moveColour}
        flipped={boardFlipped}
    />;
}

export default EvaluationBarArea;