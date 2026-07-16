import React, { useState } from "react";

import useGameSelector from "@/hooks/useGameSelector";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import GameSelector from "@/components/chess/GameSelector";
import LogMessage from "@/components/common/LogMessage";

import useImportGame from "@analysis/hooks/useImportGame";
import useEvaluateGame from "@analysis/hooks/useEvaluateGame";
import useServerEvaluateGame from "@analysis/hooks/useServerEvaluateGame";
import useSettingsStore from "@/stores/SettingsStore";
import RecentGames from "../RecentGames";
import AnalyseButton from "../../AnalyseButton";
import * as styles from "./GameSelection.module.css";

function GameSelection() {
    const { setSelectedGame } = useGameSelector();

    const engineLocation = useSettingsStore(
        state => state.settings.analysis.engine.location
    );

    const setEvaluationController = useAnalysisProgressStore(
        state => state.setEvaluationController
    );

    const [ statusMessage, setStatusMessage ] = useState<string>();
    const [ importError, setImportError ] = useState<string>();

    const importSelectedGame = useImportGame();
    const evaluateGame = useEvaluateGame();
    const serverEvaluateGame = useServerEvaluateGame();

    async function onAnalyseClick() {
        try {
            var importedGame = await importSelectedGame(setStatusMessage);
        } catch (err) {
            return setImportError((err as Error).message);
        }

        const controller = engineLocation == "server"
            ? await serverEvaluateGame(importedGame)
            : await evaluateGame(importedGame);

        setEvaluationController(controller);
    }

    return <>
        <GameSelector
            saveLocalStorage
            onGameSelect={setSelectedGame}
        />

        <AnalyseButton onClick={onAnalyseClick} />

        {statusMessage && <i className={styles.statusMessage}>
            {statusMessage}
        </i>}

        {importError && <LogMessage>
            {importError}
        </LogMessage>}

        <RecentGames/>
    </>;
}

export default GameSelection;