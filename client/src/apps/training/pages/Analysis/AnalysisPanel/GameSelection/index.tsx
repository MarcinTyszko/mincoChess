import React, { useState } from "react";

import useGameSelector from "@hooks/useGameSelector";
import GameSelector from "@apps/training/components/GameSelector";
import ErrorMessage from "@components/common/ErrorMessage";

import useImportGame from "../../useImportGame";
import useEvaluateGame from "../../useEvaluateGame";
import AnalyseButton from "./AnalyseButton";

function GameSelection() {
    const { setSelectedGame } = useGameSelector();

    const [ importError, setImportError ] = useState<string | null>(null);

    const importSelectedGame = useImportGame();
    const evaluateGame = useEvaluateGame();

    async function onAnalyseClick() {
        try {
            var importedGame = await importSelectedGame();
        } catch (err) {
            return setImportError((err as Error).message);
        }

        evaluateGame(importedGame);
    }
    
    return <>
        <GameSelector
            saveLocalStorage
            onGameSelect={setSelectedGame}
        />

        <AnalyseButton onClick={onAnalyseClick} />

        {importError
            && <ErrorMessage>
                {importError}
            </ErrorMessage>
        }
    </>;
}

export default GameSelection;