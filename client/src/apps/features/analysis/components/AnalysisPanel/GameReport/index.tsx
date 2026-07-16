import React, { useMemo } from "react";

import { getGameAccuracy } from "shared/lib/reporter/accuracy";
import { findOpeningDeviations } from "shared/lib/reporter/utils/theoryDeviation";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import AccuraciesCard from "@analysis/components/report/AccuraciesCard";
import ClassificationCountCard from "@analysis/components/report/ClassificationCountCard";
import OpeningLessonCard from "@analysis/components/report/OpeningLessonCard";

import EvaluationGraphArea from "./EvaluationGraphArea";

function GameReport() {
    const analysisGame = useAnalysisGameStore(state => state.analysisGame);

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    const accuracies = getGameAccuracy(analysisGame.stateTree);

    const openingDeviations = useMemo(() => (
        findOpeningDeviations(analysisGame.stateTree)
            .sort((a, b) => Number(b.isError) - Number(a.isError))
            .slice(0, 2)
    ), [analysisGame]);

    return <>
        <EvaluationGraphArea/>

        <AccuraciesCard
            accuracies={accuracies}
            estimatedRatings={analysisGame.estimatedRatings}
        />

        {openingDeviations.map(deviation => <OpeningLessonCard
            key={deviation.nodeId}
            deviation={deviation}
        />)}

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;
