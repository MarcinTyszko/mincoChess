import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTurnstile } from "react-turnstile";
import { StatusCodes } from "http-status-codes";

import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@apps/training/stores/AnalysisSessionStore";
import { analyseNode } from "@apps/training/lib/analysis";
import { getTopEngineLine } from "wintrchess";

function useRealtimeClassifier() {
    const { t } = useTranslation();

    const turnstile = useTurnstile();

    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        currentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const setRealtimeClassifyError = useAnalysisProgressStore(
        state => state.setRealtimeClassifyError
    );

    const {
        analysisSessionToken,
        analysisCaptchaError
    } = useAnalysisSessionStore();

    const [
        classifyStatus,
        setClassifyStatus
    ] = useState(AnalysisStatus.INACTIVE);

    // Reattempt classification that is awaiting a captcha when
    // Turnstile status changes
    useEffect(() => {
        if (classifyStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (analysisCaptchaError) {
            setRealtimeClassifyError(analysisCaptchaError);
            setClassifyStatus(AnalysisStatus.INACTIVE);

            return;
        }

        considerRealtimeClassify();
    }, [
        classifyStatus,
        analysisSessionToken,
        analysisCaptchaError
    ]);

    function cancelClassify(errorMessage?: string) {
        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError(errorMessage);
    }

    async function considerRealtimeClassify() {
        // Do not classify a root node
        if (!currentStateTreeNode.parent) return;

        // If there is not enough data for a centipawn comparison
        const parentState = currentStateTreeNode.parent.state;
        const parentTopLineDepth = getTopEngineLine(parentState)?.depth || 0;

        if (
            parentState.engineLines.length == 0
            || parentTopLineDepth < settings.engineDepth
        ) {
            return cancelClassify(
                currentStateTreeNode.state.classification == undefined
                    ? t("pages.analysis.classifiedMoveCard.insufficientLines")
                    : undefined
            );
        }

        const analyseNodeResult = await analyseNode(currentStateTreeNode, {
            includeBrilliant: settings.includedClassifications.brilliant,
            includeTheory: settings.includedClassifications.theory
        });

        // If session is invalid, await a new CAPTCHA solve
        if (analyseNodeResult.status == StatusCodes.UNAUTHORIZED) {
            turnstile.reset();
            setClassifyStatus(AnalysisStatus.AWAITING_CAPTCHA);

            return;
        }

        // For other, unknown errors, return an unknown error message
        if (
            !analyseNodeResult.node
            || analyseNodeResult.status != StatusCodes.OK
        ) {
            return cancelClassify(
                t("pages.analysis.classifiedMoveCard.unknownError")
            );
        }

        // Apply classification and deactivate classifier
        const currentState = currentStateTreeNode.state;
        const analysedState = analyseNodeResult.node.state;

        currentState.classification = analysedState.classification;
        currentState.accuracy = analysedState.accuracy;
        currentState.opening = analysedState.opening;

        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError();

        dispatchCurrentNodeUpdate();
    }

    return considerRealtimeClassify;
}

export default useRealtimeClassifier;