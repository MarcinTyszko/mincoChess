import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ChessBoard from "@components/board/ChessBoard";
import GameSelector from "@components/analysis/GameSelector";
import Button from "@components/common/Button";
import GameSource from "@constants/GameSource";
import useGameSelectorStore from "@stores/GameSelectorStore";
import parsePgn from "@lib/games/pgn";
import parseFenString from "@lib/games/fen";
import Engine from "@lib/engine";
import EngineVersion from "@constants/EngineVersion";

import * as styles from "./Analysis.module.css";

function Analysis() {
    const { t } = useTranslation();

    const {
        selectedGameSource,
        selectedGame,
        setSelectedGame,
        selectedGameInput
    } = useGameSelectorStore();

    const [ analysisError, setAnalysisError ] = useState<string | null>(null);

    async function initiateAnalysis() {
        // Validate that a game has been selected
        // Parse PGN or FEN string into Game object if necessary
        if (selectedGameSource.requiresSearch) {
            if (!selectedGame) {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.noGameSelected")
                ); 
            }
        } else {
            if (selectedGameInput.length == 0) {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.noGameSelected")
                );
            }

            try {
                setSelectedGame(
                    selectedGameSource == GameSource.PGN
                        ? parsePgn(selectedGameInput)
                        : parseFenString(selectedGameInput)
                );
            } catch {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.invalidGame")
                );
            }
        }

        // something here
        const sf = new Engine(EngineVersion.STOCKFISH_16_1_LITE_SINGLE);

        sf.setLineCount(3);
        
        const evaluationResult = await sf.evaluate(22);

        console.log(`took ${evaluationResult.elapsedTime}ms`);
        console.log(`the top move is: ${evaluationResult.lines[0].moves[0].san}`);
    }

    return <div className={styles.wrapper}>
        <div className={styles.gameContainer}>
            <ChessBoard/>
        </div>

        <div className={styles.reportContainer}>
            <div className={styles.title}>
                {t("pages.analysis.title")}
            </div>

            <GameSelector/>

            <Button
                icon={require("@assets/img/analysis.svg")}
                iconSize="30px"
                style={{
                    fontSize: "1.1rem"
                }}
                onClick={initiateAnalysis}
            >
                {t("pages.analysis.analyseButton")}
            </Button>

            {
                !!analysisError
                && <span className={styles.error}>
                    {analysisError}
                </span>
            }
        </div>
    </div>;
}

export default Analysis;