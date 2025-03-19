import React, { useEffect } from "react";
import Turnstile from "react-turnstile";
import { useTranslation } from "react-i18next";

import AnalysisStatus from "@constants/AnalysisStatus";
import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import ProgressReporter from "@components/analysis/ProgressReporter";

function ProgressArea() {
    const { t } = useTranslation();

    const {
        evaluationProgress,
        analysisStatus,
        setAnalysisStatus,
        analysisTooltip,
        setAnalysisTooltip,
        analysisError
    } = useAnalysisProgressStore();

    useEffect(() => {
        if (analysisStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (!document.hasFocus()) {
            document.title = t("pages.analysis.progressReporter.completeNotification");
        }

        function focusListener() {
            document.title = "WintrChess";
            removeEventListener("focus", focusListener);
        }

        addEventListener("focus", focusListener);
    }, [analysisStatus]);

    useEffect(() => {
        if (analysisStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (!analysisCaptchaToken) {
            return setAnalysisTooltip("Please wait for the CAPTCHA...");
        }

        setAnalysisStatus(AnalysisStatus.CLASSIFYING);

        console.log("fantastic we are ready for classification");
        console.log("mocking classification process...");

        setAnalysisStatus(AnalysisStatus.INACTIVE);
    }, [analysisCaptchaToken, analysisStatus]);

    return <>
        {
            analysisStatus != AnalysisStatus.INACTIVE
            && <ProgressReporter
                progress={evaluationProgress}
                tooltip={analysisTooltip}
                error={analysisError}
            />
        }
    </>;
}

export default ProgressArea;