import React, { lazy, useRef } from "react";
import { useTranslation } from "react-i18next";

import Breakpoints from "@constants/Breakpoints";
import AnalysisTab from "@constants/AnalysisTab";
import useResizeObserver from "@hooks/useResizeObserver";
import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisTabStore from "@apps/training/stores/AnalysisTabStore";
import ClassifiedMoveCard from "@apps/training/components/report/ClassifiedMoveCard";
import StateTreeTraverser from "@apps/training/components/StateTreeTraverser";

import AnalysisTabBar from "./AnalysisTabBar";
import AnalysisProgressArea from "./AnalysisProgressArea";
import RealtimeEngineArea from "./RealtimeEngineArea";
import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import GameAnalysis from "./GameAnalysis";
import * as styles from "./AnalysisPanel.module.css";

const OptionsToolbar = lazy(() => import("@apps/training/components/OptionsToolbar"));

function AnalysisPanel() {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const {
        contentSectionHeight,
        analysisPanelScrollable,
        setAnalysisPanelScrollable
    } = useLayoutStore();

    const { gameAnalysisOpen } = useAnalysisGameStore();

    const currentStateTreeNode = useAnalysisBoardStore(
        state => state.currentStateTreeNode
    );

    const { activeTab } = useAnalysisTabStore();

    const analysisPanelRef = useRef<HTMLDivElement>(null);

    useResizeObserver(analysisPanelRef, size => (
        setAnalysisPanelScrollable(size.fullWidth != size.innerWidth)
    ));

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

        {gameAnalysisOpen && <AnalysisTabBar/>}

        <AnalysisProgressArea/>

        {gameAnalysisOpen && <RealtimeEngineArea/>}

        {gameAnalysisOpen
            && currentStateTreeNode.state.move
            && !settings.analysis.classifications.hide
            && !(
                !settings.analysis.engine.enabled
                && currentStateTreeNode.state.classification == undefined
            )
            && <ClassifiedMoveCard/>
        }

        {gameAnalysisOpen
            ? (activeTab == AnalysisTab.REPORT
                ? <GameReport/>
                : <GameAnalysis/>
            )
            : <GameSelection/>
        }

        <StateTreeTraverser style={{
            position: "fixed",
            width: treeTraverserWidth,
            bottom: "10px",
            right: innerWidth > Breakpoints.MOBILE_LAYOUT
                ? (
                    analysisPanelScrollable ? "20px" : "10px"
                )
                : `calc(50vw - (${treeTraverserWidth}px / 2))`
        }}/>

        <div className={styles.stateTreeTraverserPlaceholder} />
    </div>;
}

export default AnalysisPanel;