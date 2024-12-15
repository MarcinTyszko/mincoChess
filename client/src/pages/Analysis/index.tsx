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

    function initiateAnalysis() {
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

            setSelectedGame(
                selectedGameSource == GameSource.PGN
                    ? parsePgn(selectedGameInput)
                    : parseFenString(selectedGameInput)
            );
        }

        // something here
        new Engine(EngineVersion.STOCKFISH_16_1_LITE_SINGLE);
    }

    return <div className={styles.wrapper}>
        <div className={styles.gameContainer}>
            <ChessBoard/>
        </div>

        <div className={styles.reportContainer}>
            <div className={styles.title}>
                Game Report
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
                Analyse
            </Button>

            <span className={styles.error}>
                {!!analysisError && analysisError}
            </span>
        </div>
    </div>;
}

export default Analysis;