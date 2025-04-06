import { useTranslation } from "react-i18next";
import { useTurnstile } from "react-turnstile";
import { StatusCodes } from "http-status-codes";

import AnalysisStatus from "@constants/AnalysisStatus";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisProgressStore from "@stores/analysis/AnalysisProgressStore";
import { classifyNode } from "@lib/stateTree/classify";

function useRealtimeClassifier(
    setClassifyStatus: (status: AnalysisStatus) => void
) {
    const { t } = useTranslation();

    const turnstile = useTurnstile();

    const {
        currentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const setRealtimeClassifyError = useAnalysisProgressStore(
        state => state.setRealtimeClassifyError
    );

    async function realtimeClassify() {
        const classificationResult = await classifyNode(currentStateTreeNode);

        if (classificationResult.status == StatusCodes.UNAUTHORIZED) {
            turnstile.reset();
            setClassifyStatus(AnalysisStatus.AWAITING_CAPTCHA);

            return;
        }

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

        currentStateTreeNode.state.classification = classificationResult.classification;

        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError();
        dispatchCurrentNodeUpdate();
    }

    return realtimeClassify;
}

export default useRealtimeClassifier;