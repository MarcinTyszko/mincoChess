import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EngineLine } from "wintrchess";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import { getSettings } from "@lib/settings";
import Engine from "@lib/engine";

import EngineLinesProps from "./EngineLinesProps";
import * as styles from "./EngineLines.module.css";

function EngineLines({ fen }: EngineLinesProps) {
    const { t } = useTranslation();

    const { currentStateTreeNode } = useAnalysisBoardStore();

    const settings = getSettings();

    const engine = useMemo(() => (
        new Engine(settings.analysis.engine)
    ), []);

    const [ localDepth, setLocalDepth ] = useState(0);

    const [ localEngineLines, setLocalEngineLines ] = useState<EngineLine[]>([]);

    const evaluationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get engine lines to display
    const cachedLines = currentStateTreeNode.state.topEngineLines(
        settings.analysis.engineLines
    );

    const localLines = localEngineLines.filter(line => line.depth == localDepth);

    const displayedLines = cachedLines.length == settings.analysis.engineLines
        ? cachedLines : localLines;

    // Evaluate position locally if no cache available
    useEffect(() => {
        if (evaluationDelayRef.current) {
            clearTimeout(evaluationDelayRef.current);
        }

        if (displayedLines == cachedLines) return;

        engine.stopEvaluation();

        evaluationDelayRef.current = setTimeout(async () => {
            engine.setLineCount(settings.analysis.engineLines);
            engine.setPosition(fen);

            let latestDepth = 0;
            let latestEngineLines: EngineLine[] = [];

            await engine.evaluate(
                settings.analysis.engineDepth,
                (depth, lines) => {
                    setLocalDepth(depth);
                    setLocalEngineLines(lines);

                    latestDepth = depth;
                    latestEngineLines = lines;
                }
            );

            if (latestDepth == settings.analysis.engineDepth) {
                currentStateTreeNode.state.engineLines.local ??= [];

                currentStateTreeNode.state.engineLines.local.push(
                    ...latestEngineLines
                );
            }
        }, 500);
    }, [fen]);

    return <div className={styles.wrapper}>
        <span className={styles.depth}>
            <span>
                {t("pages.analysis.engineLines.depth")}
            </span>

            <span>
                {displayedLines.at(0)?.depth || localDepth}
            </span>
        </span>

        {
            displayedLines.sort(
                (a, b) => a.index - b.index
            ).map((line, index) => <>
                <div className={styles.engineLine}>
                    <span
                        className={styles.evaluation}
                        style={{
                            backgroundColor: line.evaluation.value >= 0
                                ? "#fff" : "#0c0c0c",
                            color: line.evaluation.value >= 0
                                ? "#0c0c0c" : "#fff"
                        }}
                    >
                        {
                            line.evaluation.type == "centipawn"
                                ? Math.abs(line.evaluation.value / 100).toFixed(1)
                                : `M${Math.abs(line.evaluation.value)}`
                        }
                    </span>

                    {
                        line.moves.slice(0, 12).map(move => <span>
                            {move.san}
                        </span>)
                    }
                </div>

                {
                    index != (displayedLines.length - 1)
                    && <hr className={styles.engineLineSeparator} />
                }
            </>)
        }
    </div>;
}

export default EngineLines;