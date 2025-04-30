import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { range } from "lodash";
import { Chess } from "chess.js";

import {
    EngineLine,
    getNodeParentChain,
    getDisplayedLines,
    isEngineLineEqual
} from "wintrchess";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import useRealtimeEngineStore from "@apps/training/stores/RealtimeEngineStore";
import Engine from "@apps/training/lib/engine";

import EngineLineInfo from "./EngineLine";
import SkeletonLine from "./SkeletonLine";
import EngineLinesProps from "./EngineLinesProps";
import useRealtimeClassifier from "./useRealtimeClassifier";
import * as styles from "./EngineLines.module.css";

function EngineLines({ style }: EngineLinesProps) {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const { analysisGame } = useAnalysisGameStore();
    const { currentStateTreeNode } = useAnalysisBoardStore();

    const setRealtimeClassifyError = useAnalysisProgressStore(
        state => state.setRealtimeClassifyError
    );

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
    useEffect(() => setDisplayedEngineLines(
        getDisplayedLines(
            currentStateTreeNode.state,
            {
                targetSource: settings.analysis.engine,
                targetCount: settings.analysis.engineLines
            }
        ) || []
    ), [
        currentStateTreeNode,
        realtimeEngineLines,
        settings.analysis.engineLines
    ]);

    // When engine version changed or engine is toggled,
    // terminate old engine and potentially initialise new one
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

    const considerRealtimeClassify = useRealtimeClassifier();

    // Queue an evaluation & classification if it may be required
    useEffect(() => {
        setRealtimeClassifyError();

        if (!engine) return;

        engine.stopEvaluation();

        if (evaluationDelayRef.current) {
            clearTimeout(evaluationDelayRef.current);
        }

        // If cache for this node is sufficient, do not evaluate locally
        const cacheLines = getDisplayedLines(
            currentStateTreeNode.state,
            {
                targetSource: settings.analysis.engine,
                targetCount: settings.analysis.engineLines,
                targetDepth: settings.analysis.engineDepth
            }
        );
        
        if (cacheLines) {
            if (currentStateTreeNode.state.classification == undefined) {
                considerRealtimeClassify();
            }
            
            return;
        }

        setRealtimeEngineLines([]);

        // Queue local evaluation
        evaluationDelayRef.current = setTimeout(async () => {
            const playedUciMoves = getNodeParentChain(currentStateTreeNode)
                .reverse()
                .filter(node => node.state.move)
                .map(node => node.state.move!.uci);

            engine.setPosition(analysisGame.initialPosition, playedUciMoves);
            engine.setLineCount(settings.analysis.engineLines);

            let reachedDepth = 0;

            await engine.evaluate(
                settings.analysis.engineDepth,
                line => {
                    reachedDepth = Math.max(reachedDepth, line.depth);

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

            // If depth fully reached
            if (
                (
                    !new Chess(currentStateTreeNode.state.fen).isGameOver()
                    && reachedDepth < settings.analysis.engineDepth
                )
                || !currentStateTreeNode.parent
            ) return;

            considerRealtimeClassify();
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
    ), [
        currentStateTreeNode,
        settings.analysis.engineLines
    ]);

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