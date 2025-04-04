import React from "react";

import useAnalysisGameStore from "@stores/AnalysisGameStore";
import AccuraciesCard from "@components/analysis/report/AccuraciesCard";
import ClassificationCountCard from "@components/analysis/report/ClassificationCountCard";

import ProgressArea from "../ProgressArea";

function GameReport() {
    const { analysisGame } = useAnalysisGameStore();
    
    return <>
        <ProgressArea/>

        {
            analysisGame.accuracies
            && <AccuraciesCard
                accuracies={analysisGame.accuracies}
                estimatedRatings={analysisGame.estimatedRatings}
            />
        }

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;