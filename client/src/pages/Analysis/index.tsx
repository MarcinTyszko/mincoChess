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
        // Validate that a game has been selected
        if (selectedGameSource.requiresSearch && !selectedGame) {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        if (selectedGameInput.length == 0) {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        // Parse FEN or PGN into game object
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

        // Generate evaluations for each position
        evaluateMoves(
            selectedGame!,
            EngineVersion.STOCKFISH_16_1_LITE_SINGLE
        );
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