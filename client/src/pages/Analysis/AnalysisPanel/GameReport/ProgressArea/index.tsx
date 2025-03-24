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
        [AnalysisStatus.AWAITING_CAPTCHA]: "pages.analysis.progressReporter.awaitingCaptcha",
        [AnalysisStatus.CLASSIFYING]: "pages.analysis.progressReporter.classifying"
    };

    return statusTitles[status];
}

function ProgressArea() {
    const { t } = useTranslation();
    
    const turnstile = useTurnstile();

    const {
        evaluationProgress,
        analysisStatus,
        setAnalysisStatus,
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

            if (captchaError || !analysisSessionToken) {
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

                turnstile.reset();
                turnstile.execute();

                return;
            }

            setAnalysisStatus(AnalysisStatus.CLASSIFYING);

            const classifications = await classifyResponse.json();

            await new Promise(res => setTimeout(res, 1500));

            console.log("mocked classifications recieved!");
            console.log(classifications);

            setAnalysisStatus(AnalysisStatus.INACTIVE);
        }

        effect();
    }, [analysisSessionToken, analysisStatus]);

    const statusTitle = getStatusTitle(analysisStatus);

    return <>
        {
            analysisStatus != AnalysisStatus.INACTIVE
            && <ProgressReporter
                progress={evaluationProgress}
                title={statusTitle ? t(statusTitle) : undefined}
                tooltip={t("pages.analysis.progressReporter.tooltip")}
                error={analysisError}
            />
        }
    </>;
}

export default ProgressArea;