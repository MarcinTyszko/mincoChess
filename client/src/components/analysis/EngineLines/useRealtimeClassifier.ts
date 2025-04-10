import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTurnstile } from "react-turnstile";
import { StatusCodes } from "http-status-codes";

import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisGameStore from "@stores/analysis/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisProgressStore from "@stores/analysis/AnalysisProgressStore";
import useAnalysisSessionStore from "@stores/analysis/AnalysisSessionStore";
import { classifyNode, classifyStateTree } from "@lib/stateTree/classify";
import { getTopEngineLine } from "wintrchess";

function useRealtimeClassifier() {
    const { t } = useTranslation();

    const turnstile = useTurnstile();

    const { settings } = useSettingsStore();

    const { analysisGame } = useAnalysisGameStore();

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
            || parentTopLineDepth < settings.analysis.engineDepth
        ) {
            return cancelClassify(
                currentStateTreeNode.state.classification == undefined
                    ? t("pages.analysis.classifiedMoveCard.insufficientLines")
                    : undefined
            );
        }

        // Classify node and classify whole tree again for accuracies
        // CHANGE THIS LATER WHEN ACCURACIES IS SEPARATE ALGORITHM
        const classifyNodeResult = await classifyNode(currentStateTreeNode);
        const classifyTreeResult = await classifyStateTree(analysisGame.stateTree);

        // If session is invalid, await a new CAPTCHA solve
        if (
            classifyNodeResult.status == StatusCodes.UNAUTHORIZED
            || classifyTreeResult.status == StatusCodes.UNAUTHORIZED
        ) {
            turnstile.reset();
            setClassifyStatus(AnalysisStatus.AWAITING_CAPTCHA);

            return;
        }

        // For other, unknown errors, return an unknown error message
        if (
            !classifyNodeResult.classification
            || !classifyTreeResult.gameAnalysis
            || classifyNodeResult.status != StatusCodes.OK
            || classifyTreeResult.status != StatusCodes.OK
        ) {
            return cancelClassify(
                t("pages.analysis.classifiedMoveCard.unknownError")
            );
        }

        // Apply classification and deactivate classifier
        currentStateTreeNode.state.classification = classifyNodeResult.classification;
        analysisGame.accuracies = classifyTreeResult.gameAnalysis.accuracies;

        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError();

        dispatchCurrentNodeUpdate();
    }

    return considerRealtimeClassify;
}

export default useRealtimeClassifier;