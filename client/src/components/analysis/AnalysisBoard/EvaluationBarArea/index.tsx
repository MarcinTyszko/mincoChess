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

    // Compare real-time engine lines with cached ones
    const currentLocalState = clone(currentStateTreeNode.state);
    currentLocalState.engineLines = realtimeEngineLines;

    const topLocalLine = currentLocalState.topEngineLine();

    const topCachedLine = currentStateTreeNode.state.topEngineLine();
    const cachedDepth = topCachedLine?.depth || -Infinity;

    return <EvaluationBar
        height={analysisBoardWidth}
        evaluation={
            realtimeEngineDepth > cachedDepth
                ? (topLocalLine?.evaluation || DEFAULT_EVALUATION)
                : (topCachedLine?.evaluation || DEFAULT_EVALUATION)
        }
        flipped={boardFlipped}
    />;
}

export default EvaluationBarArea;