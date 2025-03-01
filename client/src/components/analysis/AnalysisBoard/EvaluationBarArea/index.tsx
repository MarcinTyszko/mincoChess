import React from "react";
import { clone } from "lodash";

import { Evaluation } from "wintrchess";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@stores/RealtimeEngineStore";
import EvaluationBar from "@components/analysis/EvaluationBar";

const DEFAULT_EVALUATION: Evaluation = {
    type: "centipawn",
    value: 0
};

function EvaluationBarArea() {
    const { analysisBoardWidth } = useLayoutStore();

    const {
        currentStateTreeNode,
        boardFlipped
    } = useAnalysisBoardStore();

    const {
        realtimeEngineDepth,
        realtimeEngineLines
    } = useRealtimeEngineStore();

    const liminalState = clone(currentStateTreeNode.state);
    liminalState.engineLines = { local: realtimeEngineLines };

    const topCachedLine = currentStateTreeNode.state.topEngineLine();
    const topLiminalLine = liminalState.topEngineLine();

    return <EvaluationBar
        height={analysisBoardWidth}
        evaluation={
            realtimeEngineDepth > (topCachedLine?.depth || 0)
                ? (topLiminalLine?.evaluation || DEFAULT_EVALUATION)
                : (topCachedLine?.evaluation || DEFAULT_EVALUATION)
        }
        flipped={boardFlipped}
    />;
}

export default EvaluationBarArea;