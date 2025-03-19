import React from "react";
import { useTranslation } from "react-i18next";
import Turnstile from "react-turnstile";

import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@stores/AnalysisSessionStore";

function CaptchaArea() {
    const { t } = useTranslation();

    const { setAnalysisError } = useAnalysisProgressStore();

    const { setAnalysisSessionToken } = useAnalysisSessionStore();

    function refreshAnalysisSession(captchaToken: string) {
        
    }

    return <>
        {
            process.env.TURNSTILE_ANALYSIS_SITE_KEY
            && <Turnstile
                sitekey={process.env.TURNSTILE_ANALYSIS_SITE_KEY}
                onSuccess={async token => {
                    await fetch("/api/analysis/session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ token })
                    });
                }}
                onUnsupported={() => setAnalysisError(
                    t("pages.analysis.progressReporter.captchaLoadFailed")
                )}
                onError={() => setAnalysisError(
                    t("pages.analysis.progressReporter.captchaUnknownError")
                )}
                style={{ display: "none" }}
            />
        }   
    </>;
}

export default CaptchaArea;