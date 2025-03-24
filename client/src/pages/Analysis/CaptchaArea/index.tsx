import React from "react";
import { useTranslation } from "react-i18next";
import Turnstile from "react-turnstile";

import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@stores/AnalysisSessionStore";

function CaptchaArea() {
    const { t } = useTranslation();

    const { setCaptchaError } = useAnalysisProgressStore();

    const { setAnalysisSessionToken } = useAnalysisSessionStore();

    async function requestAnalysisSession(captchaToken: string) {
        const sessionResponse = await fetch("/api/analysis/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: captchaToken })
        });

        if (!sessionResponse.ok) {
            return setCaptchaError(
                t("pages.analysis.progressReporter.captchaUnknownError")
            );
        }

        const sessionToken = await sessionResponse.text();

        setAnalysisSessionToken(sessionToken);
        setCaptchaError();
    }

    return <>
        {
            process.env.TURNSTILE_ANALYSIS_SITE_KEY
            && <Turnstile
                sitekey={process.env.TURNSTILE_ANALYSIS_SITE_KEY}
                refreshExpired="manual"
                onSuccess={requestAnalysisSession}
                onUnsupported={() => setCaptchaError(
                    t("pages.analysis.progressReporter.captchaLoadFailed")
                )}
                onError={() => setCaptchaError(
                    t("pages.analysis.progressReporter.captchaUnknownError")
                )}
                style={{ display: "none" }}
            />
        }
    </>;
}

export default CaptchaArea;