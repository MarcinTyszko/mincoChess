import React from "react";
import { useShallow } from "zustand/react/shallow";

import { getNodeChain, getGameAccuracy } from "wintrchess";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import EvaluationGraph from "@apps/training/components/report/EvaluationGraph";
import AccuraciesCard from "@apps/training/components/report/AccuraciesCard";
import ClassificationCountCard from "@apps/training/components/report/ClassificationCountCard";
import playBoardSound from "@lib/boardSounds";

function GameReport() {
    const { analysisGame } = useAnalysisGameStore();

    const {
        setCurrentStateTreeNode
    } = useAnalysisBoardStore(
        useShallow(state => ({
            currentStateTreeNodeUpdate: state.currentStateTreeNodeUpdate,
            setCurrentStateTreeNode: state.setCurrentStateTreeNode
        }))
    );

    const mainlineChain = getNodeChain(analysisGame.stateTree);
    const accuracies = getGameAccuracy(analysisGame.stateTree);
    
    return <>
        <EvaluationGraph
            nodes={mainlineChain}
            onPointClick={point => {
                const clickedNode = mainlineChain.find(
                    node => node.id == point.nodeId
                );
                if (!clickedNode) return;

                setCurrentStateTreeNode(clickedNode);
                playBoardSound(clickedNode);
            }}
        />

        <AccuraciesCard
            accuracies={accuracies}
            estimatedRatings={analysisGame.estimatedRatings}
        />

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;