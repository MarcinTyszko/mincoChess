import React, { lazy, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import Breakpoints from "@constants/Breakpoints";
import AnalysisTab from "@constants/AnalysisTab";
import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisTabStore from "@apps/training/stores/AnalysisTabStore";
import EngineLines from "@apps/training/components/EngineLines";
import ClassifiedMoveCard from "@apps/training/components/report/ClassifiedMoveCard";
import StateTreeTraverser from "@apps/training/components/StateTreeTraverser";

import AnalysisTabBar from "./AnalysisTabBar";
import ProgressArea from "./ProgressArea";
import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import GameAnalysis from "./GameAnalysis";
import * as styles from "./AnalysisPanel.module.css";

const OptionsToolbar = lazy(() => import("@apps/training/components/OptionsToolbar"));

function AnalysisPanel() {
    const { t } = useTranslation();

    const {
        engineEnabled,
        classificationsHidden
    } = useSettingsStore(
        useShallow(state => ({
            engineEnabled: state.settings.analysis.engineEnabled,
            classificationsHidden: state.settings.analysis.hideClassifications
        }))
    );

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

    useEffect(() => {
        if (!analysisPanelRef.current) return;

        const analysisPanelObserver = new ResizeObserver(entries => {
            const analysisPanel = entries[0].target as HTMLDivElement;

            setAnalysisPanelScrollable(
                analysisPanel.offsetWidth != analysisPanel.clientWidth
            );
        });

        analysisPanelObserver.observe(analysisPanelRef.current);
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
            && <AnalysisTabBar/>
        }

        <ProgressArea/>

        {
            gameAnalysisOpen
            && <EngineLines
                style={{
                    display: (
                        activeTab == AnalysisTab.REPORT
                        || !engineEnabled
                    ) ? "none" : undefined
                }}
            />
        }

        {
            gameAnalysisOpen
            && currentStateTreeNode.parent
            && !classificationsHidden
            && !(
                !engineEnabled
                && currentStateTreeNode.state.classification == undefined
            )
            && <ClassifiedMoveCard/>
        }

        {
            gameAnalysisOpen
                ? (activeTab == AnalysisTab.REPORT
                    ? <GameReport/>
                    : <GameAnalysis/>
                )
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