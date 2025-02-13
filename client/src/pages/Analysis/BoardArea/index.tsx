import React, { useEffect, useRef } from "react";

import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import Breakpoints from "@constants/Breakpoints";
import AnalysisBoard from "@components/analysis/AnalysisBoard";

import * as styles from "./BoardArea.module.css";

function BoardArea() {
    const {
        contentSectionHeight,
        analysisBoardContainerWidth,
        setAnalysisBoardContainerWidth
    } = useLayoutStore();

    const { analysisGame } = useAnalysisGameStore();

    const boardContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardContainerRef.current) return;

        const boardContainerResizeObserver = new ResizeObserver(entries => {
            setAnalysisBoardContainerWidth(entries[0].target.clientWidth);
        });

        boardContainerResizeObserver.observe(boardContainerRef.current);
    }, []);

    return <div
        className={styles.boardContainer}
        ref={boardContainerRef}
    >
        <AnalysisBoard
            topProfile={analysisGame.players.black}
            bottomProfile={analysisGame.players.white}
            style={{
                width: innerWidth > Breakpoints.MOBILE_LAYOUT
                    ? (
                        `min(${contentSectionHeight - 110}px, `
                        + `${analysisBoardContainerWidth - 40}px)`
                    )
                    : undefined
            }}
        />
    </div>;
}

export default BoardArea;