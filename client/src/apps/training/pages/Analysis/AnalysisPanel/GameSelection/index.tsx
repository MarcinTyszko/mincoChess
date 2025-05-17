import React, { useState } from "react";

import useGameSelector from "@hooks/useGameSelector";
import GameSelector from "@apps/training/components/GameSelector";
import LogMessage from "@components/common/LogMessage";

import useImportGame from "../../useImportGame";
import useEvaluateGame from "../../useEvaluateGame";
import AnalyseButton from "./AnalyseButton";
import * as styles from "./GameSelection.module.css";

function GameSelection() {
    const { setSelectedGame } = useGameSelector();

    const [ statusMessage, setStatusMessage ] = useState<string>();
    const [ importError, setImportError ] = useState<string>();

    const importSelectedGame = useImportGame();
    const evaluateGame = useEvaluateGame();

    async function onAnalyseClick() {
        try {
            var importedGame = await importSelectedGame(setStatusMessage);
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

        {statusMessage
            && <i className={styles.statusMessage}>
                {statusMessage}
            </i>
        }

        {importError
            && <LogMessage>
                {importError}
            </LogMessage>
        }
    </>;
}

export default GameSelection;