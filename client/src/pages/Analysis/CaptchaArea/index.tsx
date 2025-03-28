import React from "react";
import { useTranslation } from "react-i18next";
import Turnstile from "react-turnstile";

import useAnalysisSessionStore from "@stores/AnalysisSessionStore";

function CaptchaArea() {
    const { t } = useTranslation();

    const {
        setAnalysisSessionToken,
        setAnalysisCaptchaError
    } = useAnalysisSessionStore();

    async function requestAnalysisSession(captchaToken: string) {
        const sessionResponse = await fetch("/api/analysis/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: captchaToken })
        });

        if (!sessionResponse.ok) {
            return setAnalysisCaptchaError(
                t("pages.analysis.progressReporter.captchaVerifyFailed")
            );
        }

        const sessionToken = await sessionResponse.text();

        setAnalysisSessionToken(sessionToken);
        setAnalysisCaptchaError();
    }

    return <>
        {
            process.env.TURNSTILE_ANALYSIS_SITE_KEY
            && <Turnstile
                sitekey={process.env.TURNSTILE_ANALYSIS_SITE_KEY}
                refreshExpired="manual"
                onSuccess={requestAnalysisSession}
                onUnsupported={() => setAnalysisCaptchaError(
                    t("pages.analysis.progressReporter.captchaLoadFailed")
                )}
                onError={() => setAnalysisCaptchaError(
                    t("pages.analysis.progressReporter.captchaUnknownError")
                )}
                style={{ display: "none" }}
            />
        }
    </>;
}

export default CaptchaArea;