import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { uniqWith } from "lodash";

import { getNodeParentChain, isEngineLineEqual } from "wintrchess";
import AnalysisTab from "@apps/analysis/constants/AnalysisTab";
import useRealtimeAnalyser from "@apps/analysis/hooks/useRealtimeAnalyser";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisTabStore from "@apps/analysis/stores/AnalysisTabStore";
import useAnalysisGameStore from "@apps/analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/analysis/stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@apps/analysis/stores/RealtimeEngineStore";
import RealtimeEngine from "@apps/analysis/components/RealtimeEngine";

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

    const considerRealtimeAnalyse = useRealtimeAnalyser();

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

            considerRealtimeAnalyse();
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