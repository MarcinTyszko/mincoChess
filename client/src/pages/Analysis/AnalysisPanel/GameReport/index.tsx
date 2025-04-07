import React from "react";

import useAnalysisGameStore from "@stores/analysis/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import AccuraciesCard from "@components/analysis/report/AccuraciesCard";
import ClassificationCountCard from "@components/analysis/report/ClassificationCountCard";

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