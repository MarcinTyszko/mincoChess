import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { round } from "lodash";

import AnalysisBoard from "@components/analysis/AnalysisBoard";
import GameSelector from "@components/analysis/GameSelector";
import StateTreeTraverser from "@components/analysis/StateTreeTraverser";
import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import Button from "@components/common/Button";
import useLayoutStore from "@stores/LayoutStore";
import Breakpoints from "@constants/Breakpoints";

import useAnalysis from "./useAnalysis";
import * as styles from "./Analysis.module.css";
import StateTreeEditor from "@components/analysis/StateTreeEditor";

function Analysis() {
    const { t } = useTranslation();

    const {
        contentSectionHeight,
        analysisBoardContainerWidth,
        setAnalysisBoardContainerWidth
    } = useLayoutStore();

    const {
        setSelectedGame,
        setGameSelectorError
    } = useGameSelectorStore();

    const {
        analysisGame,
        setCurrentStateTreeNode
    } = useAnalysisGameStore();

    const [ analysisProgress, setAnalysisProgress ] = useState(0);
    const [ analysisError, setAnalysisError ] = useState<string | null>(null);

    const analyse = useAnalysis(setAnalysisError, setAnalysisProgress);

    const boardContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardContainerRef.current) return;

        const boardContainerResizeObserver = new ResizeObserver(entries => {
            setAnalysisBoardContainerWidth(entries[0].target.clientWidth);
        });

        boardContainerResizeObserver.observe(boardContainerRef.current);
    }, []);

    return <div className={styles.wrapper}>
        <div
            className={styles.boardContainer}
            ref={boardContainerRef}
        >
            <AnalysisBoard
                topProfile={{
                    title: "IM",
                    username: "Levy Krabs",
                    rating: 2322
                }}
                bottomProfile={{
                    title: "GM",
                    username: "Spongebob Kasparov",
                    rating: 2851
                }}
                style={{
                    width: innerWidth > Breakpoints.MOBILE_LAYOUT
                        ? (
                            `min(${contentSectionHeight - 110}px, `
                            + `${analysisBoardContainerWidth - 40}px)`
                        )
                        : undefined
                }}
            />
        </div>

        <div
            className={styles.reportContainer}
            style={{
                height: innerWidth > Breakpoints.MOBILE_LAYOUT
                    ? `${contentSectionHeight}px`
                    : undefined
            }}
        >
            <div className={styles.title}>
                {t("pages.analysis.title")}
            </div>

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

            <span style={{ color: "white" }}>
                PROGRESS: {round(analysisProgress * 100, 1)}%
            </span>

            {
                analysisError
                && <span className={styles.error}>
                    {analysisError}
                </span>
            }

            {
                analysisGame
                && <StateTreeEditor
                    stateTreeRootNode={analysisGame.stateTree}
                    onMoveClick={setCurrentStateTreeNode}
                    style={{
                        backgroundColor: "#1c1c1c",
                        borderRadius: "10px",
                        padding: "7px 10px",
                        height: "405px",
                        overflowY: "auto"
                    }}
                />
            }

            <StateTreeTraverser
                style={{
                    position: "fixed",
                    bottom: "10px",
                    right: innerWidth > Breakpoints.MOBILE_LAYOUT
                        ? "10px"
                        : `calc(50vw - (${innerWidth > 400 ? 365 : 280}px / 2))`
                }}
            />
        </div>
    </div>;
}

export default Analysis;