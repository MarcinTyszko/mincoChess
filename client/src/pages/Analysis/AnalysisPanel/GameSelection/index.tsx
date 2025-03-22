import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { AnalysisGame } from "wintrchess";
import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import GameSelector from "@components/analysis/GameSelector";
import Button from "@components/common/Button";
import ErrorMessage from "@components/common/ErrorMessage";
import evaluateMoves from "@lib/evaluate";

import useImportGame from "../../useImportGame";

function GameSelection() {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const {
        setSelectedGame,
        setGameSelectorError
    } = useGameSelectorStore();

    const {
        setEvaluationProgress,
        setAnalysisStatus,
        setAnalysisTooltip,
        setAnalysisError
    } = useAnalysisProgressStore();

    const [ importError, setImportError ] = useState<string | null>(null);

    const importGame = useImportGame(setImportError);

    async function evaluate(analysisGame: AnalysisGame) {
        setAnalysisStatus(AnalysisStatus.EVALUATING);

        // Generate evaluations for each position
        try {
            var evaluatedStates = await evaluateMoves(
                analysisGame,
                {
                    engineVersion: settings.analysis.engine,
                    engineDepth: settings.analysis.engineDepth,
                    cloudEngineLines: settings.analysis.engineLines,
                    maxEngineCount: 4,
                    engineConfig: engine => {
                        engine.setLineCount(2);
                        engine.setThreadCount(4);
                    },
                    onProgress: setEvaluationProgress
                }
            );

            setAnalysisStatus(AnalysisStatus.AWAITING_CAPTCHA);

            console.log(evaluatedStates);
        } catch {
            setAnalysisStatus(AnalysisStatus.INACTIVE);

            setAnalysisError(
                t("pages.analysis.analysisError")
            );

            return;
        }
    }
    
    return <>
        <GameSelector
            saveCookies
            onChange={setSelectedGame}
            setError={setGameSelectorError}
        />

        <Button
            icon={require("@assets/img/analysis.svg")}
            iconSize="30px"
            style={{ fontSize: "1.1rem" }}
            onClick={() => {
                setAnalysisStatus(AnalysisStatus.INACTIVE);

                setAnalysisTooltip(
                    t("pages.analysis.progressReporter.defaultTooltip")
                );
                setAnalysisError();

                const analysisGame = importGame();
                if (!analysisGame) return;

                evaluate(analysisGame);
            }}
        >
            {t("pages.analysis.analyseButton")}
        </Button>

        {
            importError
            && <ErrorMessage>
                {importError}
            </ErrorMessage>
        }
    </>;
}

export default GameSelection;