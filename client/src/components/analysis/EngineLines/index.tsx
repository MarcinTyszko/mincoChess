import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { range } from "lodash";

import { EngineLine } from "wintrchess";
import useDelayedEffect from "@hooks/useDelayedEffect";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@stores/RealtimeEngineStore";
import Engine from "@lib/engine";

import EngineLineInfo from "./EngineLine";
import SkeletonLine from "./SkeletonLine";
import * as styles from "./EngineLines.module.css";

function EngineLines() {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const { currentStateTreeNode } = useAnalysisBoardStore();

    const { setDisplayedEngineLines } = useRealtimeEngineStore();

    const [
        realtimeEngineLines,
        setRealtimeEngineLines
    ] = useState<EngineLine[]>([]);

    const [ engine, setEngine ] = useState(
        () => new Engine(settings.analysis.engine)
    );

    const displayedEngineLines = useMemo(() => (
        currentStateTreeNode.state.displayedLines({
            targetSource: settings.analysis.engine,
            targetCount: settings.analysis.engineLines
        }) || []
    ), [
        currentStateTreeNode,
        realtimeEngineLines
    ]);

    useEffect(() => {
        setDisplayedEngineLines(displayedEngineLines);
    }, [displayedEngineLines]);

    useDelayedEffect(() => {
        engine.terminate();

        setEngine(
            new Engine(settings.analysis.engine)
        );
    }, [settings.analysis.engine]);

    const evaluationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        engine.stopEvaluation();

        if (evaluationDelayRef.current) {
            clearTimeout(evaluationDelayRef.current);
        }

        const cacheLines = currentStateTreeNode.state.displayedLines({
            targetSource: settings.analysis.engine,
            targetCount: settings.analysis.engineLines,
            targetDepth: settings.analysis.engineDepth
        });
        
        if (cacheLines) return;

        setRealtimeEngineLines([]);

        evaluationDelayRef.current = setTimeout(() => {
            engine.setPosition(currentStateTreeNode.state.fen);
            engine.setLineCount(settings.analysis.engineLines);

            engine.evaluate(
                settings.analysis.engineDepth,
                line => {
                    currentStateTreeNode.state.engineLines.push(line);

                    setRealtimeEngineLines(
                        prev => [ ...prev, line ]
                    );
                }
            );
        }, 400);
    }, [
        currentStateTreeNode,
        settings.analysis.engine,
        settings.analysis.engineDepth,
        settings.analysis.engineLines
    ]);

    return <div className={styles.wrapper}>
        <span className={styles.depth}>
            <span>
                {t("pages.analysis.engineLines.depth")}
            </span>

            <span>
                {displayedEngineLines.at(0)?.depth || 0}
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