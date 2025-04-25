import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StatusCodes } from "http-status-codes";

import { findNodeRecursively } from "wintrchess";
import { useAltcha } from "@hooks/useAltcha";
import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@apps/training/stores/AnalysisSessionStore";
import { analyseGame } from "@apps/training/lib/reporter";
import ProgressReporter from "@apps/training/components/ProgressReporter";

function getStatusTitle(status: AnalysisStatus) {
    const statusTitles: Record<string, string | undefined> = {
        [AnalysisStatus.EVALUATING]: "pages.analysis.progressReporter.evaluating",
        [AnalysisStatus.AWAITING_CAPTCHA]: "pages.analysis.progressReporter.awaitingCaptcha"
    };

    return statusTitles[status];
}

function ProgressArea() {
    const { t } = useTranslation();

    const executeCaptcha = useAltcha();

    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        analysisGame,
        setAnalysisGame
    } = useAnalysisGameStore();

    const setCurrentStateTreeNode = useAnalysisBoardStore(
        state => state.setCurrentStateTreeNode
    );

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

            const analyseResult = await analyseGame(analysisGame.stateTree, {
                includeBrilliant: settings.includedClassifications.brilliant,
                includeTheory: settings.includedClassifications.theory
            });

            // For any errors, display message or reset CAPTCHA
            if (analyseResult.status == StatusCodes.UNAUTHORIZED) {
                return executeCaptcha();
            } else if (analyseResult.status != StatusCodes.OK) {
                return setAnalysisError(
                    t("pages.analysis.progressReporter.classifyFailed")
                );
            }

            if (!analyseResult.gameAnalysis) {
                return setAnalysisStatus(AnalysisStatus.INACTIVE);
            }

            // Update analysed game with new analysis object
            setAnalysisGame({
                ...analysisGame,
                ...analyseResult.gameAnalysis
            });

            // Set current state tree node to equivalent in new tree
            setCurrentStateTreeNode(prev => {
                if (!analyseResult.gameAnalysis) {
                    return prev;
                }

                return findNodeRecursively(
                    analyseResult.gameAnalysis.stateTree,
                    node => node.id == prev.id
                ) || prev;
            });

            // Return to inactive analysis state
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