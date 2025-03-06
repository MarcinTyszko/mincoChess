import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { isEqual, range, uniqWith } from "lodash";

import { EngineLine } from "wintrchess";
import useDelayedEffect from "@hooks/useDelayedEffect";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@stores/RealtimeEngineStore";
import { getSettings } from "@lib/settings";
import Engine from "@lib/engine";

import EngineLineInfo from "./EngineLine";
import SkeletonLine from "./SkeletonLine";
import * as styles from "./EngineLines.module.css";

function EngineLines() {
    const { t } = useTranslation();

    const { currentStateTreeNode } = useAnalysisBoardStore();

    const {
        realtimeEngineDepth,
        setRealtimeEngineDepth,
        realtimeEngineLines,
        setRealtimeEngineLines,
        displayedEngineDepth,
        setDisplayedEngineDepth,
        displayedEngineLines,
        setDisplayedEngineLines
    } = useRealtimeEngineStore();

    const settings = getSettings();

    const [ engine, setEngine ] = useState(
        () => new Engine(settings.analysis.engine)
    );

    useDelayedEffect(() => {
        engine.terminate();

        setEngine(
            new Engine(settings.analysis.engine)
        );
    }, [settings.analysis.engine]);

    const evaluationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get engine lines to display
    const calculatedDisplayedLines = useMemo(() => {
        const cachedLines = currentStateTreeNode.state.topEngineLines(
            settings.analysis.engineLines
        );
    
        const cachedDepth = cachedLines.at(0)?.depth || 0;
    
        const localLines = realtimeEngineLines.filter(
            line => line.depth == realtimeEngineDepth
        );
    
        return (
            cachedLines.length == settings.analysis.engineLines
            && cachedDepth >= settings.analysis.engineDepth
        ) ? cachedLines : localLines;
    }, [currentStateTreeNode, realtimeEngineLines]);

    useEffect(() => {
        const displayedDepth = calculatedDisplayedLines.at(0)?.depth;

        if (displayedDepth) {
            setDisplayedEngineDepth(displayedDepth);
        }

        if (calculatedDisplayedLines.length >= settings.analysis.engineLines) {
            setDisplayedEngineLines(calculatedDisplayedLines);
        }
    }, [calculatedDisplayedLines]);

    // Evaluate position locally if no cache available
    useEffect(() => {
        engine.stopEvaluation();

        if (evaluationDelayRef.current) {
            clearTimeout(evaluationDelayRef.current);
        }

        const cachedLines = currentStateTreeNode.state.topEngineLines(
            settings.analysis.engineLines
        );

        // If they are both empty you should still evaluate locally
        if (
            isEqual(calculatedDisplayedLines, cachedLines)
            && calculatedDisplayedLines.length > 0
        ) return;

        evaluationDelayRef.current = setTimeout(async () => {
            engine.setLineCount(settings.analysis.engineLines);
            engine.setPosition(currentStateTreeNode.state.fen);

            let latestDepth = 0;
            let latestEngineLines: EngineLine[] = [];

            await engine.evaluate(
                settings.analysis.engineDepth,
                (depth, lines) => {
                    setRealtimeEngineDepth(depth);
                    setRealtimeEngineLines(lines.slice());

                    latestDepth = depth;
                    latestEngineLines = lines;
                }
            );

            // If preferred depth not reached and it is not mate (depth 0 return)
            if (
                latestDepth != settings.analysis.engineDepth
                && latestDepth != 0
            ) return;

            currentStateTreeNode.state.engineLines.local = uniqWith(
                [
                    ...(currentStateTreeNode.state.engineLines.local || []),
                    ...latestEngineLines
                ],
                (a, b) => (
                    a.depth == b.depth
                    && a.index == b.index
                )
            );
        }, 500);
    }, [currentStateTreeNode]);

    return <div className={styles.wrapper}>
        <span className={styles.depth}>
            <span>
                {t("pages.analysis.engineLines.depth")}
            </span>

            <span>
                {displayedEngineDepth}
            </span>
        </span>

        {
            displayedEngineLines.sort(
                (a, b) => a.index - b.index
            ).map((line, index) => <>
                <EngineLineInfo line={line} />

                {
                    index != (displayedEngineLines.length - 1)
                    && <hr className={styles.engineLineSeparator} />
                }
            </>)
        }

        {
            displayedEngineLines.at(0)?.depth != 0
            && range(
                Math.max(0, settings.analysis.engineLines - displayedEngineLines.length)
            ).map(() => <>
                <hr className={styles.engineLineSeparator} />

                <SkeletonLine/>
            </>)
        }
    </div>;
}

export default EngineLines;