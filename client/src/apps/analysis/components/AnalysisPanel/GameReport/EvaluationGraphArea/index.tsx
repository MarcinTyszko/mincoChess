import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { findIndex } from "lodash";

import { getNodeChain } from "wintrchess";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/analysis/stores/AnalysisBoardStore";
import EvaluationGraph from "@apps/analysis/components/report/EvaluationGraph";
import playBoardSound from "@apps/analysis/components/AnalysisBoard/boardSounds";

function EvaluationGraphArea() {
    const analysisGame = useAnalysisGameStore(state => state.analysisGame);

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore(
        useShallow(state => ({
            currentStateTreeNodeUpdate: state.currentStateTreeNodeUpdate,
            currentStateTreeNode: state.currentStateTreeNode,
            setCurrentStateTreeNode: state.setCurrentStateTreeNode
        }))
    );

    const mainlineChain = useMemo(() => (
        getNodeChain(analysisGame.stateTree)
    ), [analysisGame]);

    return <EvaluationGraph
        nodes={mainlineChain}
        selectedIndex={findIndex(
            mainlineChain,
            node => node.id == currentStateTreeNode.id
        )}
        onPointClick={point => {
            const clickedNode = mainlineChain.find(
                node => node.id == point.nodeId
            );
            if (!clickedNode) return;

            setCurrentStateTreeNode(clickedNode);
            playBoardSound(clickedNode);
        }}
    />;
}

export default EvaluationGraphArea;