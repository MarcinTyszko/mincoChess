import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import AnalysisStatus from "@apps/analysis/constants/AnalysisStatus";
import useAnalysisProgressStore from "@apps/analysis/stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@apps/analysis/stores/AnalysisSessionStore";
import ProgressReporter from "@apps/analysis/components/ProgressReporter";

import useAnalyseGame from "../../useAnalyseGame";

function getStatusTitle(status: AnalysisStatus) {
    const statusTitles: Record<string, string | undefined> = {
        [AnalysisStatus.EVALUATING]: "pages.analysis.progressReporter.evaluating",
        [AnalysisStatus.AWAITING_CAPTCHA]: "pages.analysis.progressReporter.awaitingCaptcha"
    };

    return statusTitles[status];
}

function AnalysisProgress() {
    const { t } = useTranslation();

    const {
        evaluationProgress,
        analysisStatus,
        analysisError,
        setAnalysisError
    } = useAnalysisProgressStore();

    const {
        analysisSessionToken,
        analysisCaptchaError
    } = useAnalysisSessionStore();

    const analyseGame = useAnalyseGame();

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
        if (analysisStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (analysisCaptchaError) {
            return setAnalysisError(analysisCaptchaError);
        }

        analyseGame();
    }, [
        analysisSessionToken,
        analysisStatus,
        analysisCaptchaError
    ]);

    const statusTitle = getStatusTitle(analysisStatus);

    if (analysisStatus == AnalysisStatus.INACTIVE) return null;

    return <ProgressReporter
        progress={evaluationProgress}
        title={statusTitle ? t(statusTitle) : undefined}
        tooltip={analysisStatus == AnalysisStatus.EVALUATING
            ? t("pages.analysis.progressReporter.evaluatingTooltip")
            : t("pages.analysis.progressReporter.captchaTooltip")
        }
        error={analysisError}
    />;
}

export default AnalysisProgress;