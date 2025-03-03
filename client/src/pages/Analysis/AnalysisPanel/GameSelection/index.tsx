import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useGameSelectorStore from "@stores/GameSelectorStore";
import GameSelector from "@components/analysis/GameSelector";
import Button from "@components/common/Button";

import useAnalysis from "../../useAnalysis";
import * as styles from "./GameSelection.module.css";

function GameSelection() {
    const { t } = useTranslation();

    const {
        setSelectedGame,
        setGameSelectorError
    } = useGameSelectorStore();

    const [ analysisError, setAnalysisError ] = useState<string | null>(null);

    const analyse = useAnalysis(setAnalysisError);
    
    return <>
        <GameSelector
            saveCookies
            onChange={setSelectedGame}
            setError={setGameSelectorError}
        />

        <Button
            icon={require("@assets/img/analysis.svg")}
            iconSize="30px"
            style={{
                fontSize: "1.1rem"
            }}
            onClick={analyse}
        >
            {t("pages.analysis.analyseButton")}
        </Button>

        {
            analysisError
            && <span className={styles.error}>
                {analysisError}
            </span>
        }
    </>;
}

export default GameSelection;