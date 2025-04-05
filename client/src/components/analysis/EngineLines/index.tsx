import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chess } from "chess.js";
import { range } from "lodash";

import { EngineLine, getDisplayedLines, isEngineLineEqual } from "wintrchess";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useRealtimeEngineStore from "@stores/RealtimeEngineStore";
import Engine from "@lib/engine";

import EngineLineInfo from "./EngineLine";
import SkeletonLine from "./SkeletonLine";
import EngineLinesProps from "./EngineLinesProps";
import * as styles from "./EngineLines.module.css";

function EngineLines({ style }: EngineLinesProps) {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const { currentStateTreeNode } = useAnalysisBoardStore();

    const {
        displayedEngineLines,
        setDisplayedEngineLines
    } = useRealtimeEngineStore();

    const [
        realtimeEngineLines,
        setRealtimeEngineLines
    ] = useState<EngineLine[]>([]);

    const [ engine, setEngine ] = useState<Engine | undefined>();

    // Update displayed engine lines when move changed,
    // or when the real time lines update
    useEffect(() => {
        setDisplayedEngineLines(
            getDisplayedLines(
                currentStateTreeNode.state,
                {
                    targetSource: settings.analysis.engine,
                    targetCount: settings.analysis.engineLines
                }
            ) || []
        );
    }, [
        currentStateTreeNode,
        realtimeEngineLines
    ]);

    useEffect(() => {
        engine?.terminate();

        if (settings.analysis.engineEnabled) {
            const newEngine = new Engine(settings.analysis.engine);
            setEngine(newEngine);

            return () => newEngine.terminate();
        } else {
            setEngine(undefined);
        }
    }, [
        settings.analysis.engineEnabled,
        settings.analysis.engine
    ]);

    const evaluationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Queue an evaluation if it may be required
    useEffect(() => {
        if (!engine) return;

        engine.stopEvaluation();

        if (evaluationDelayRef.current) {
            clearTimeout(evaluationDelayRef.current);
        }

        const cacheLines = getDisplayedLines(
            currentStateTreeNode.state,
            {
                targetSource: settings.analysis.engine,
                targetCount: settings.analysis.engineLines,
                targetDepth: settings.analysis.engineDepth
            }
        );
        
        if (cacheLines) return;

        setRealtimeEngineLines([]);

        evaluationDelayRef.current = setTimeout(() => {
            engine.setPosition(currentStateTreeNode.state.fen);
            engine.setLineCount(settings.analysis.engineLines);

            engine.evaluate(
                settings.analysis.engineDepth,
                line => {
                    const engineLines = currentStateTreeNode.state.engineLines;

                    setRealtimeEngineLines(prev => [ ...prev, line ]);
                    
                    const duplicateLine = engineLines.find(
                        existingLine => isEngineLineEqual(existingLine, line)
                    );

                    if (duplicateLine) {
                        currentStateTreeNode.state.engineLines = engineLines.filter(
                            line => line != duplicateLine
                        );
                    }

                    currentStateTreeNode.state.engineLines.push(line);
                }
            );
        }, 400);
    }, [
        currentStateTreeNode,
        engine,
        settings.analysis.engineDepth,
        settings.analysis.engineLines
    ]);

    const displayedLineCount = useMemo(() => (
        Math.min(
            new Chess(currentStateTreeNode.state.fen).moves().length,
            settings.analysis.engineLines
        )
    ), [currentStateTreeNode]);

    return <div
        className={styles.wrapper}
        style={style}
    >
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
                Math.max(0, displayedLineCount - displayedEngineLines.length)
            ).map(() => <>
                <hr className={styles.engineLineSeparator} />

                <SkeletonLine/>
            </>)
        }
    </div>;
}

export default EngineLines;