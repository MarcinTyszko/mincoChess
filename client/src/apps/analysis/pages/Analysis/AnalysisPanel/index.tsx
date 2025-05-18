import React, { lazy, useRef } from "react";
import { useTranslation } from "react-i18next";

import Breakpoints from "@constants/Breakpoints";
import AnalysisTab from "@apps/analysis/constants/AnalysisTab";
import useResizeObserver from "@hooks/useResizeObserver";
import useLayoutStore from "@stores/LayoutStore";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/analysis/stores/AnalysisBoardStore";
import useAnalysisTabStore from "@apps/analysis/stores/AnalysisTabStore";
import ClassifiedMoveCard from "@apps/analysis/components/report/ClassifiedMoveCard";
import StateTreeTraverser from "@apps/analysis/components/StateTreeTraverser";

import AnalysisTabBar from "./AnalysisTabBar";
import AnalysisProgress from "./AnalysisProgress";
import RealtimeEngineArea from "./RealtimeEngineArea";
import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import GameAnalysis from "./GameAnalysis";
import * as styles from "./AnalysisPanel.module.css";

const OptionsToolbar = lazy(() => import("@apps/analysis/components/OptionsToolbar"));

function AnalysisPanel() {
    const { t } = useTranslation();

    const {
        contentSectionHeight,
        analysisPanelScrollable,
        setAnalysisPanelScrollable
    } = useLayoutStore();

    const { settings } = useSettingsStore();

    const gameAnalysisOpen = useAnalysisGameStore(
        state => state.gameAnalysisOpen
    );

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

        <AnalysisProgress/>

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

        {/* <Advertisement
            adUnitId="3904113611"
            format={innerWidth > Breakpoints.MOBILE_LAYOUT
                ? "rectangle" : "horizontal"
            }
        /> */}

        <StateTreeTraverser style={{
            position: "fixed",
            width: treeTraverserWidth,
            bottom: "10px",
            right: innerWidth > Breakpoints.MOBILE_LAYOUT
                ? (analysisPanelScrollable ? "20px" : "10px")
                : `calc(50vw - (${treeTraverserWidth}px / 2))`
        }}/>

        <div className={styles.stateTreeTraverserPlaceholder} />
    </div>;
}

export default AnalysisPanel;