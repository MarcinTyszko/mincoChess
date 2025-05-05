import React, { useState } from "react";

import useGameSelectorStore from "@stores/GameSelectorStore";
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

    const [ importError, setImportError ] = useState<string | null>(null);

    const importGame = useImportGame();
    const evaluateGame = useEvaluateGame();

    function onAnalyseClick() {
        try {
            var importedGame = importGame();
        } catch (err) {
            return setImportError((err as Error).message);
        }

        evaluateGame(importedGame);
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