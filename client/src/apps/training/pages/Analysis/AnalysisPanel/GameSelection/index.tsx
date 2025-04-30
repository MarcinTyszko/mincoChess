import React, { useState } from "react";

import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import GameSelector from "@apps/training/components/GameSelector";
import ErrorMessage from "@components/common/ErrorMessage";

import useImportGame from "../../useImportGame";
import useEvaluateGame from "../../useEvaluateGame";
import AnalyseButton from "./AnalyseButton";

function GameSelection() {
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

        <AnalyseButton onClick={onAnalyseClick} />

        {
            importError
            && <ErrorMessage>
                {importError}
            </ErrorMessage>
        }
    </>;
}

export default GameSelection;