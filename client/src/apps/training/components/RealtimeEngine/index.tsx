import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chess } from "chess.js";
import { range } from "lodash";

import {
    EngineLine,
    pickEngineLines
} from "wintrchess";
import ErrorMessage from "@components/common/ErrorMessage";
import Engine from "@apps/training/lib/engine";

import EngineLineInfo from "./EngineLine";
import SkeletonLine from "./SkeletonLine";
import RealtimeEngineProps from "./RealtimeEngineProps";
import * as styles from "./RealtimeEngine.module.css";

type Timeout = ReturnType<typeof setTimeout>;

function RealtimeEngine({
    className,
    style,
    position,
    playedUciMoves,
    config,
    cachedEngineLines,
    onEngineLines,
    onEvaluationStart,
    onEvaluationComplete
}: RealtimeEngineProps) {
    const hydratedConfig = {
        ...config,
        lines: config.lines || 1,
        threads: config.threads || 1
    };

    const { t } = useTranslation();

    const [ engine, setEngine ] = useState<Engine>();

    const [
        realtimeEngineLines,
        setRealtimeEngineLines
    ] = useState<EngineLine[]>([]);

    const [ evaluationError, setEvaluationError ] = useState<string>();

    const evaluationDelayRef = useRef<Timeout>();

    async function evaluatePosition() {
        if (!engine) return;

        engine.setPosition(position, playedUciMoves);
        engine.setLineCount(hydratedConfig.lines);
        engine.setThreadCount(hydratedConfig.threads);

        try {
            onEvaluationStart?.();

            const lines = await engine.evaluate({
                depth: hydratedConfig.depth,
                timeLimit: (
                    hydratedConfig.timeLimit
                    && (hydratedConfig.timeLimit * 1000)
                ),
                onEngineLine: line => {
                    setRealtimeEngineLines(prev => [ ...prev, line ]);
                }
            });

            onEvaluationComplete?.(lines);
        } catch {
            setEvaluationError(
                t("pages.analysis.realtimeEngine.error")
            );
        }
    }

    // Instantiate new engine when version changes
    useEffect(() => {
        engine?.terminate();

        const newEngine = new Engine(hydratedConfig.version);
        setEngine(newEngine);

        return () => newEngine.terminate();
    }, [hydratedConfig.version]);

    // Evaluate position when settings or position change
    useEffect(() => {
        async function queueEvaluation() {
            await engine?.stopEvaluation();

            if (evaluationDelayRef.current) {
                clearTimeout(evaluationDelayRef.current);
            }

            setRealtimeEngineLines([]);

            evaluationDelayRef.current = setTimeout(evaluatePosition, 400);
        }

        queueEvaluation();
    }, [
        position,
        playedUciMoves,
        engine,
        hydratedConfig.depth,
        hydratedConfig.lines
    ]);

    const expectedLineCount = useMemo(() => Math.min(
        new Chess(position).moves().length,
        hydratedConfig.lines
    ), [position, hydratedConfig.lines]);

    const displayedLines = useMemo(() => {
        if (cachedEngineLines) {
            const displayedCacheLines = pickEngineLines(
                cachedEngineLines,
                {
                    count: hydratedConfig.lines,
                    depth: hydratedConfig.depth,
                    source: hydratedConfig.version
                }
            );

            if (displayedCacheLines) return displayedCacheLines;
        }

        return pickEngineLines(realtimeEngineLines, {
            count: hydratedConfig.lines,
            source: hydratedConfig.version
        }) || [];
    }, [realtimeEngineLines]);

    useEffect(
        () => onEngineLines?.(displayedLines),
        [displayedLines]
    );

    return <div
        className={`${styles.wrapper} ${className}`}
        style={style}
    >
        <span className={styles.depth}>
            <span>
                {t("pages.analysis.realtimeEngine.depth")}
            </span>

            <span>
                {displayedLines.at(0)?.depth || 0}
            </span>
        </span>

        {displayedLines.map((line, index) => <>
            <EngineLineInfo line={line} />

            {index != (displayedLines.length - 1)
                && <hr className={styles.engineLineSeparator} />
            }
        </>)}

        {displayedLines.at(0)?.depth != 0
            && range(
                Math.max(0, expectedLineCount - displayedLines.length)
            ).map(() => <>
                <hr className={styles.engineLineSeparator} />
                <SkeletonLine/>
            </>)
        }

        {evaluationError
            && <ErrorMessage>
                {evaluationError}
            </ErrorMessage>
        }
    </div>;
}

export default RealtimeEngine;