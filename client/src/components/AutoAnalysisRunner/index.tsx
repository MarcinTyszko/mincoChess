import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import useSettingsStore from "@/stores/SettingsStore";
import useAutoAnalysisStore from "@/stores/AutoAnalysisStore";
import { runAutoAnalysis } from "@/lib/autoAnalysis";
import displayToast from "@/lib/toast";

/**
 * @description Headless runner for the automatic analysis of the
 * signed-in user's recent games. Mounted on every page except the
 * analysis app, where it would compete with the foreground engines.
 */
function AutoAnalysisRunner() {
    const { t } = useTranslation("common");

    const autoAnalyseEnabled = useSettingsStore(
        state => state.settings.analysis.autoAnalyseRecentGames
    );

    const entries = useAutoAnalysisStore(state => state.entries);

    const queueAnnounced = useRef(false);
    const completionAnnounced = useRef(false);

    useEffect(() => {
        if (!autoAnalyseEnabled) return;
        if (location.pathname.startsWith("/analysis")) return;

        runAutoAnalysis().catch(() => {
            // External account or archive unavailable; retry next page load
            useAutoAnalysisStore.getState().setStarted(false);
        });
    }, [autoAnalyseEnabled]);

    useEffect(() => {
        if (entries.length == 0) return;

        if (!queueAnnounced.current) {
            queueAnnounced.current = true;

            displayToast({
                message: t("autoAnalysis.startedToast", {
                    count: entries.length
                }),
                theme: "info",
                autoClose: 5
            });
        }

        const analysedCount = entries.filter(
            entry => entry.status == "done"
        ).length;

        const finished = entries.every(
            entry => entry.status == "done" || entry.status == "error"
        );

        if (finished && analysedCount > 0 && !completionAnnounced.current) {
            completionAnnounced.current = true;

            displayToast({
                message: t("autoAnalysis.finishedToast", {
                    count: analysedCount
                }),
                theme: "success",
                autoClose: 5
            });
        }
    }, [entries]);

    return null;
}

export default AutoAnalysisRunner;
