import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ChessBoard from "@components/board/ChessBoard";
import GameSelector from "@components/analysis/GameSelector";
import Button from "@components/common/Button";
import GameSource from "@constants/GameSource";
import useGameSelectorStore from "@stores/GameSelectorStore";
import parsePgn from "@lib/games/pgn";
import parseFenString from "@lib/games/fen";
import evaluateMoves from "@lib/evaluate";
import EngineVersion from "@constants/EngineVersion";
import useLayoutStore from "@stores/LayoutStore";

import * as styles from "./Analysis.module.css";

function Analysis() {
    const { t } = useTranslation();

    const { setAnalysisBoardContainerWidth } = useLayoutStore();

    const {
        selectedGameSource,
        selectedGame,
        setSelectedGame,
        selectedGameInput
    } = useGameSelectorStore();

    const [ analysisProgress, setAnalysisProgress ] = useState(0);
    const [ analysisError, setAnalysisError ] = useState<string | null>(null);

    const boardContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardContainerRef.current) return;

        const boardContainerResizeObserver = new ResizeObserver(entries => {
            setAnalysisBoardContainerWidth(entries[0].target.clientWidth);
        });

        boardContainerResizeObserver.observe(boardContainerRef.current);
    }, []);

    async function initiateAnalysis() {
        let analysisGame = selectedGame;

        // Validate that a game has been selected
        if (selectedGameSource.requiresSearch) {
            if (!selectedGame) {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.noGameSelected")
                );
            }
        } else if (selectedGameInput.length == 0) {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        } else {
            // Parse FEN or PGN into game object
            try {
                analysisGame = selectedGameSource == GameSource.PGN
                    ? parsePgn(selectedGameInput)
                    : parseFenString(selectedGameInput);

                setSelectedGame(analysisGame);
            } catch {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.invalidGame")
                );
            }
        } 

        // Generate evaluations for each position
        const evaluatedStates = await evaluateMoves(
            analysisGame!,
            {
                engineVersion: EngineVersion.STOCKFISH_16_1_LITE_SINGLE,
                engineDepth: 18,
                maxEngineCount: 4,
                engineConfig: engine => engine.setLineCount(2),
                verbose: true,
                onProgress: progress => setAnalysisProgress(progress)
            }
        );

        console.log(evaluatedStates);
    }

    return <div className={styles.wrapper}>
        <div
            className={styles.gameContainer}
            ref={boardContainerRef}
        >
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

            <span style={{ color: "white" }}>
                PROGRESS: {analysisProgress * 100}%
            </span>

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