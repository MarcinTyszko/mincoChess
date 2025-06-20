import React from "react";

import { getGameAccuracy } from "shared/lib/reporter/accuracy/gameAccuracy";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/analysis/stores/AnalysisBoardStore";
import AccuraciesCard from "@apps/analysis/components/report/AccuraciesCard";
import ClassificationCountCard from "@apps/analysis/components/report/ClassificationCountCard";

import EvaluationGraphArea from "./EvaluationGraphArea";

function GameReport() {
    const analysisGame = useAnalysisGameStore(state => state.analysisGame);

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    const accuracies = getGameAccuracy(analysisGame.stateTree);
    
    return <>
        <EvaluationGraphArea/>

        <AccuraciesCard accuracies={accuracies} />

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;