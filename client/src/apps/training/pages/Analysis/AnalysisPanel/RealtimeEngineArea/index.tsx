import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { uniqWith } from "lodash";

import { getNodeParentChain, isEngineLineEqual } from "wintrchess";
import AnalysisTab from "@constants/AnalysisTab";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisTabStore from "@apps/training/stores/AnalysisTabStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@apps/training/stores/RealtimeEngineStore";
import useRealtimeClassifier from "./useRealtimeClassifier";
import RealtimeEngine from "@apps/training/components/RealtimeEngine";

function RealtimeEngineArea() {
    const { settings } = useSettingsStore();

    const { activeTab } = useAnalysisTabStore();

    const initialPosition = useAnalysisGameStore(
        state => state.analysisGame.initialPosition
    );

    const {
        currentStateTreeNode,
        currentEngineLines
    } = useAnalysisBoardStore(
        useShallow(state => ({
            currentStateTreeNode: state.currentStateTreeNode,
            currentEngineLines: state.currentStateTreeNode.state.engineLines
        }))
    );

    const setDisplayedEngineLines = useRealtimeEngineStore(
        state => state.setDisplayedEngineLines
    );

    const considerRealtimeClassify = useRealtimeClassifier();

    const playedUciMoves = useMemo(() => (
        getNodeParentChain(currentStateTreeNode)
            .reverse()
            .filter(node => node.state.move)
            .map(node => node.state.move!.uci)
    ), [currentStateTreeNode]);

    return <RealtimeEngine
        initialPosition={initialPosition}
        playedUciMoves={playedUciMoves}
        config={{
            ...settings.analysis.engine,
            timeLimit: settings.analysis.engine.timeLimitEnabled
                ? settings.analysis.engine.timeLimit
                : undefined
        }}
        cachedEngineLines={currentEngineLines}
        onEngineLines={setDisplayedEngineLines}
        onEvaluationComplete={lines => {
            currentStateTreeNode.state.engineLines = uniqWith(
                currentStateTreeNode.state.engineLines.concat(lines),
                isEngineLineEqual
            );

            considerRealtimeClassify();
        }}
        style={{
            display: (
                activeTab == AnalysisTab.REPORT
                || !settings.analysis.engine.enabled
            ) ? "none" : undefined
        }}
    />;
}

export default RealtimeEngineArea;