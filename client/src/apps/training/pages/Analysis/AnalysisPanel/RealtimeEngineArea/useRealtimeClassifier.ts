import { useState, useEffect } from "react";
import { StatusCodes } from "http-status-codes";

import { useAltcha } from "@hooks/useAltcha";
import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@apps/training/stores/AnalysisSessionStore";
import { analyseNode } from "@apps/training/lib/reporter";

function useRealtimeClassifier() {
    const executeCaptcha = useAltcha();

    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        analysisSessionToken,
        analysisCaptchaError
    } = useAnalysisSessionStore();

    const {
        currentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const setRealtimeClassifyError = useAnalysisProgressStore(
        state => state.setRealtimeClassifyError
    );

    const [
        classifyStatus,
        setClassifyStatus
    ] = useState(AnalysisStatus.INACTIVE);

    function cancelClassify(errorString?: string) {
        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError(errorString);
    }

    // Reattempt classification when CAPTCHA token updates
    useEffect(() => {
        if (classifyStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (analysisCaptchaError) {
            return cancelClassify(analysisCaptchaError);
        }

        considerRealtimeClassify();
    }, [
        classifyStatus,
        analysisSessionToken,
        analysisCaptchaError
    ]);

    async function considerRealtimeClassify() {
        if (!currentStateTreeNode.parent) return;

        // If there is not enough data for a centipawn comparison
        const parentState = currentStateTreeNode.parent.state;

        if (parentState.engineLines.length == 0) {
            if (currentStateTreeNode.state.classification != undefined) {
                return;
            }

            return cancelClassify(
                "pages.analysis.classifiedMoveCard.insufficientLines"
            );
        }

        const analyseNodeResult = await analyseNode(currentStateTreeNode, {
            includeBrilliant: settings.classifications.included.brilliant,
            includeTheory: settings.classifications.included.theory
        });

        // If session is invalid, await a new CAPTCHA solve
        if (analyseNodeResult.status == StatusCodes.UNAUTHORIZED) {
            executeCaptcha();
            setClassifyStatus(AnalysisStatus.AWAITING_CAPTCHA);

            return;
        }

        if (!analyseNodeResult.node) {
            return cancelClassify(
                "pages.analysis.classifiedMoveCard.unknownError"
            );
        }

        // Apply classification and deactivate classifier
        const currentState = currentStateTreeNode.state;
        const analysedState = analyseNodeResult.node.state;

        currentState.classification = analysedState.classification;
        currentState.accuracy = analysedState.accuracy;
        currentState.opening = analysedState.opening;

        if (analysedState.classification == undefined) {
            return cancelClassify(
                "pages.analysis.classifiedMoveCard.unknownError"
            );
        }

        cancelClassify();
        dispatchCurrentNodeUpdate();
    }

    return considerRealtimeClassify;
}

export default useRealtimeClassifier;