import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import GameSelector from "@apps/training/components/GameSelector";
import Button from "@components/common/Button";
import ErrorMessage from "@components/common/ErrorMessage";

import useImportGame from "../../useImportGame";
import useEvaluateGame from "../../useEvaluateGame";
import * as styles from "./GameSelection.module.css";

function GameSelection() {
    const { t } = useTranslation();

    const {
        setSelectedGame,
        setGameSelectorError
    } = useGameSelectorStore();

    const { setAnalysisError } = useAnalysisProgressStore();

    const [ importError, setImportError ] = useState<string | null>(null);

    const importGame = useImportGame();
    const evaluateGame = useEvaluateGame();

    function onAnalyseClick() {
        try {
            var analysisGame = importGame();

            if (!analysisGame) return;
        } catch (err) {
            return setImportError((err as Error).message);
        }

        try {
            evaluateGame(analysisGame);
        } catch (err) {
            setAnalysisError((err as Error).message);
        }
    }
    
    return <>
        <GameSelector
            saveCookies
            onChange={setSelectedGame}
            setError={setGameSelectorError}
        />

        <Button
            className={styles.analyseButton}
            icon={require("@assets/img/analysis.svg")}
            iconSize="30px"
            onClick={onAnalyseClick}
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