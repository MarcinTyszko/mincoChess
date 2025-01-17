import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { round } from "lodash";

import AnalysisBoard from "@components/board/AnalysisBoard";
import GameSelector from "@components/analysis/GameSelector";
import Button from "@components/common/Button";
import useLayoutStore from "@stores/LayoutStore";
import Breakpoints from "@constants/Breakpoints";

import useAnalysis from "./useAnalysis";
import * as styles from "./Analysis.module.css";

function Analysis() {
    const { t } = useTranslation();

    const {
        contentSectionHeight,
        analysisBoardContainerWidth,
        setAnalysisBoardContainerWidth
    } = useLayoutStore();

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
            className={styles.gameContainer}
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
                            `min(${contentSectionHeight - 150}px, `
                            + `${analysisBoardContainerWidth - 120}px)`
                        )
                        : undefined
                }}
            />
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
        </div>
    </div>;
}

export default Analysis;