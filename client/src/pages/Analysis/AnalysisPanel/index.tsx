import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import Breakpoints from "@constants/Breakpoints";
import OptionsToolbar from "@components/analysis/OptionsToolbar";
import StateTreeTraverser from "@components/analysis/StateTreeTraverser";

import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import * as styles from "./AnalysisPanel.module.css";

function AnalysisPanel() {
    const { t } = useTranslation();

    const {
        contentSectionHeight,
        analysisPanelScrollable,
        setAnalysisPanelScrollable
    } = useLayoutStore();

    const { gameAnalysisOpen } = useAnalysisGameStore();

    const analysisPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!analysisPanelRef.current) return;

        const analysisPanelObserver = new ResizeObserver(entries => {
            const analysisPanel = entries[0].target as HTMLDivElement;

            setAnalysisPanelScrollable(
                analysisPanel.offsetWidth != analysisPanel.clientWidth
            );
        });

        analysisPanelObserver.observe(analysisPanelRef.current)
    }, []);

    const treeTraverserWidth = innerWidth > Breakpoints.MOBILE_LAYOUT
        ? (analysisPanelScrollable ? 355 : 365)
        : (innerWidth > 400 ? 365 : 280);
    
    return <div
        className={styles.wrapper}
        style={{
            height: innerWidth > Breakpoints.MOBILE_LAYOUT
                ? `${contentSectionHeight}px`
                : undefined
        }}
        ref={analysisPanelRef}
    >
        <div className={styles.title}>
            {t("pages.analysis.title")}
        </div>

        <OptionsToolbar/>

        {
            gameAnalysisOpen
                ? <GameReport/>
                : <GameSelection/>
        }

        <StateTreeTraverser
            style={{
                position: "fixed",
                width: treeTraverserWidth,
                bottom: "10px",
                right: innerWidth > Breakpoints.MOBILE_LAYOUT
                    ? (
                        analysisPanelScrollable ? "20px" : "10px"
                    )
                    : `calc(50vw - (${treeTraverserWidth}px / 2))`
            }}
        />

        <div className={styles.stateTreeTraverserPlaceholder} />
    </div>;
}

export default AnalysisPanel;