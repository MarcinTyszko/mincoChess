import React from "react";

import useAnalysisGameStore from "@stores/AnalysisGameStore";
import AccuraciesCard from "@components/analysis/report/AccuraciesCard";
import ClassificationCountCard from "@components/analysis/report/ClassificationCountCard";

import ProgressArea from "../ProgressArea";

function GameReport() {
    const { analysisGame } = useAnalysisGameStore();

    const accuracies = analysisGame.accuracies || {
        white: 0,
        black: 0
    };
    
    return <>
        <ProgressArea/>

        <AccuraciesCard
            accuracies={accuracies}
            estimatedRatings={analysisGame.estimatedRatings}
        />

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;