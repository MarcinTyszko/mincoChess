import React, { useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import useResizeObserver from "@hooks/useResizeObserver";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import Breakpoints from "@constants/Breakpoints";
import AnalysisBoard from "@apps/analysis/components/AnalysisBoard";

import * as styles from "./BoardArea.module.css";

function BoardArea() {
    const {
        contentSectionHeight,
        analysisBoardContainerWidth,
        setAnalysisBoardContainerWidth
    } = useLayoutStore(
        useShallow(state => ({
            contentSectionHeight: state.contentSectionHeight,
            analysisBoardContainerWidth: state.analysisBoardContainerWidth,
            setAnalysisBoardContainerWidth: state.setAnalysisBoardContainerWidth
        }))
    );

    const { analysisGame } = useAnalysisGameStore();

    const boardContainerRef = useRef<HTMLDivElement>(null);

    useResizeObserver(boardContainerRef, size => (
        setAnalysisBoardContainerWidth(size.fullWidth)
    ));

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