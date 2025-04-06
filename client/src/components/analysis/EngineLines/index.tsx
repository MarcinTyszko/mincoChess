import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { range } from "lodash";
import { Chess } from "chess.js";

import { EngineLine, getDisplayedLines, isEngineLineEqual } from "wintrchess";
import AnalysisStatus from "@constants/AnalysisStatus";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisSessionStore from "@stores/analysis/AnalysisSessionStore";
import useAnalysisProgressStore from "@stores/analysis/AnalysisProgressStore";
import useRealtimeEngineStore from "@stores/RealtimeEngineStore";
import Engine from "@lib/engine";

import EngineLineInfo from "./EngineLine";
import SkeletonLine from "./SkeletonLine";
import EngineLinesProps from "./EngineLinesProps";
import useRealtimeClassifier from "./useRealtimeClassifier";
import * as styles from "./EngineLines.module.css";

function EngineLines({ style }: EngineLinesProps) {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

    const { currentStateTreeNode } = useAnalysisBoardStore();

    const {
        analysisSessionToken,
        analysisCaptchaError
    } = useAnalysisSessionStore();

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

    const [
        classifyStatus,
        setClassifyStatus
    ] = useState(AnalysisStatus.INACTIVE);

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
        realtimeEngineLines
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

    const realtimeClassify = useRealtimeClassifier(setClassifyStatus);

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
                realtimeClassify();
            }

            return;
        }

        setRealtimeEngineLines([]);

        // Queue local evaluation
        evaluationDelayRef.current = setTimeout(async () => {
            engine.setPosition(currentStateTreeNode.state.fen);
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

            // If depth fully reached, and node does not already have a classification
            // and it is not a root node with no parent, generate a classification
            if (
                (
                    reachedDepth > 0
                    && reachedDepth < settings.analysis.engineDepth
                )
                || currentStateTreeNode.state.classification != undefined
                || !currentStateTreeNode.parent
            ) return;

            realtimeClassify();
        }, 400);
    }, [
        currentStateTreeNode,
        engine,
        settings.analysis.engineDepth,
        settings.analysis.engineLines
    ]);

    useEffect(() => {
        if (classifyStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (analysisCaptchaError) {
            setRealtimeClassifyError(analysisCaptchaError);
            setClassifyStatus(AnalysisStatus.INACTIVE);

            return;
        }

        realtimeClassify();
    }, [
        classifyStatus,
        analysisSessionToken,
        analysisCaptchaError
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