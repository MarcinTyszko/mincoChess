import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTurnstile } from "react-turnstile";

import AnalysisStatus from "@constants/AnalysisStatus";
import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@stores/AnalysisSessionStore";
import ProgressReporter from "@components/analysis/ProgressReporter";

function getStatusTitle(status: AnalysisStatus) {
    const statusTitles: Record<string, string | undefined> = {
        [AnalysisStatus.EVALUATING]: "pages.analysis.progressReporter.evaluating",
        [AnalysisStatus.CLASSIFYING]: "pages.analysis.progressReporter.classifying"
    };

    return statusTitles[status]
        || "pages.analysis.progressReporter.evaluating";
}

function ProgressArea() {
    const { t } = useTranslation();
    
    const turnstile = useTurnstile();

    const {
        evaluationProgress,
        analysisStatus,
        setAnalysisStatus,
        analysisTooltip,
        setAnalysisTooltip,
        analysisError,
        setAnalysisError,
        captchaError
    } = useAnalysisProgressStore();

    const { analysisSessionToken } = useAnalysisSessionStore();

    // Tab notification for complete analysis
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

    // Attempt to classify generated evaluations
    useEffect(() => {
        async function effect() {
            if (analysisStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

            if (captchaError) {
                setAnalysisError(captchaError);
                
                turnstile.reset();
                turnstile.execute();
                
                return;
            }

            const classifyResponse = await fetch("/api/analysis/classify", {
                method: "POST"
            });

            if (!classifyResponse.ok) {
                setAnalysisError();
                setAnalysisTooltip(
                    t("pages.analysis.progressReporter.captchaDelay")
                );

                turnstile.reset();
                turnstile.execute();

                return;
            }

            setAnalysisStatus(AnalysisStatus.CLASSIFYING);

            const classifications = await classifyResponse.json();

            console.log("mocked classifications recieved!");
            console.log(classifications);

            setAnalysisStatus(AnalysisStatus.INACTIVE);
        }

        effect();
    }, [analysisSessionToken, analysisStatus]);

    return <>
        {
            analysisStatus != AnalysisStatus.INACTIVE
            && <ProgressReporter
                progress={evaluationProgress}
                title={t(getStatusTitle(analysisStatus))}
                tooltip={analysisTooltip}
                error={analysisError}
            />
        }
    </>;
}

export default ProgressArea;