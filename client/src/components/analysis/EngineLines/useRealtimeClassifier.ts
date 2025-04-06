import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTurnstile } from "react-turnstile";
import { StatusCodes } from "http-status-codes";

import AnalysisStatus from "@constants/AnalysisStatus";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisProgressStore from "@stores/analysis/AnalysisProgressStore";
import useAnalysisSessionStore from "@stores/analysis/AnalysisSessionStore";
import { classifyNode } from "@lib/stateTree/classify";

function useRealtimeClassifier() {
    const { t } = useTranslation();

    const turnstile = useTurnstile();

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

    async function considerRealtimeClassify() {
        // Do not classify a move that already has a classification
        if (currentStateTreeNode.state.classification != undefined) {
            return;
        }

        // If there is not enough data for a centipawn comparison
        const parentEngineLines = currentStateTreeNode.parent?.state.engineLines
            || [];

        if (parentEngineLines.length == 0) {
            setClassifyStatus(AnalysisStatus.INACTIVE);
            setRealtimeClassifyError(
                t("pages.analysis.classifiedMoveCard.insufficientData")
            );

            return;
        }

        const classificationResult = await classifyNode(currentStateTreeNode);

        // If session is invalid, await a new CAPTCHA solve
        if (classificationResult.status == StatusCodes.UNAUTHORIZED) {
            turnstile.reset();
            setClassifyStatus(AnalysisStatus.AWAITING_CAPTCHA);

            return;
        }

        // For other, unknown errors, return an unknown error message
        if (
            !classificationResult.classification
            || classificationResult.status != StatusCodes.OK
        ) {
            setClassifyStatus(AnalysisStatus.INACTIVE);
            setRealtimeClassifyError(
                t("pages.analysis.classifiedMoveCard.errorMessage")
            );

            return;
        }

        // Apply classification and deactivate classifier
        currentStateTreeNode.state.classification = classificationResult.classification;

        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError();
        dispatchCurrentNodeUpdate();
    }

    return considerRealtimeClassify;
}

export default useRealtimeClassifier;