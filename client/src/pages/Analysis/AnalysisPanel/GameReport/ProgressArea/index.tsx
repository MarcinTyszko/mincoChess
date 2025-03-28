import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTurnstile } from "react-turnstile";
import { StatusCodes } from "http-status-codes";

import AnalysisStatus from "@constants/AnalysisStatus";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@stores/AnalysisSessionStore";
import classifyStateTree from "@lib/stateTree/classify";
import ProgressReporter from "@components/analysis/ProgressReporter";

function getStatusTitle(status: AnalysisStatus) {
    const statusTitles: Record<string, string | undefined> = {
        [AnalysisStatus.EVALUATING]: "pages.analysis.progressReporter.evaluating",
        [AnalysisStatus.AWAITING_CAPTCHA]: "pages.analysis.progressReporter.awaitingCaptcha"
    };

    return statusTitles[status];
}

function ProgressArea() {
    const { t } = useTranslation();

    const turnstile = useTurnstile();

    const {
        analysisGame,
        setAnalysisGame
    } = useAnalysisGameStore();

    const {
        evaluationProgress,
        analysisStatus,
        setAnalysisStatus,
        analysisError,
        setAnalysisError
    } = useAnalysisProgressStore();

    const {
        analysisSessionToken,
        analysisCaptchaError
    } = useAnalysisSessionStore();

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

            if (analysisCaptchaError) {
                return setAnalysisError(analysisCaptchaError);
            }

            const classifyResult = await classifyStateTree(analysisGame.stateTree);

            if (classifyResult.status == StatusCodes.UNAUTHORIZED) {
                return turnstile.reset();
            } else if (classifyResult.status != StatusCodes.OK) {
                return setAnalysisError(
                    t("pages.analysis.progressReporter.classifyFailed")
                );
            }

            if (!classifyResult.gameAnalysis) {
                return setAnalysisStatus(AnalysisStatus.INACTIVE);
            }

            setAnalysisGame({
                ...analysisGame,
                ...classifyResult.gameAnalysis
            });

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
                tooltip={
                    analysisStatus == AnalysisStatus.EVALUATING
                        ? t("pages.analysis.progressReporter.evaluatingTooltip")
                        : t("pages.analysis.progressReporter.captchaTooltip")
                }
                error={analysisError}
            />
        }
    </>;
}

export default ProgressArea;