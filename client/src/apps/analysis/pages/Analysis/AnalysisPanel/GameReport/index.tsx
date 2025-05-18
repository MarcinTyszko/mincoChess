import React, { useMemo } from "react";

import { getGameAccuracy } from "wintrchess";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import AccuraciesCard from "@apps/analysis/components/report/AccuraciesCard";
import ClassificationCountCard from "@apps/analysis/components/report/ClassificationCountCard";

import EvaluationGraphArea from "./EvaluationGraphArea";

function GameReport() {
    const analysisGame = useAnalysisGameStore(state => state.analysisGame);

    const accuracies = useMemo(() => (
        getGameAccuracy(analysisGame.stateTree)
    ), [analysisGame]);
    
    return <>
        <EvaluationGraphArea/>

        <AccuraciesCard
            accuracies={accuracies}
            estimatedRatings={analysisGame.estimatedRatings}
        />

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;