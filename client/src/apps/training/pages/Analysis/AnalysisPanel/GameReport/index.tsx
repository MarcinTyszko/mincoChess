import React from "react";

import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import AccuraciesCard from "@apps/training/components/report/AccuraciesCard";
import ClassificationCountCard from "@apps/training/components/report/ClassificationCountCard";

function GameReport() {
    const { analysisGame } = useAnalysisGameStore();

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    const accuracies = analysisGame.accuracies || {
        white: 0,
        black: 0
    };
    
    return <>
        <AccuraciesCard
            accuracies={accuracies}
            estimatedRatings={analysisGame.estimatedRatings}
        />

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;