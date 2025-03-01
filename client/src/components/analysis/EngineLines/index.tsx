import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EngineLine } from "wintrchess";
import { getSettings } from "@lib/settings";
import Engine from "@lib/engine";

import EngineLinesProps from "./EngineLinesProps";
import * as styles from "./EngineLines.module.css";

function EngineLines({ fen }: EngineLinesProps) {
    const { t } = useTranslation();

    const settings = getSettings();

    const engine = useMemo(() => (
        new Engine(settings.analysis.engine)
    ), []);

    const [ depth, setDepth ] = useState(0);

    const [ engineLines, setEngineLines ] = useState<EngineLine[]>([]);

    const evaluationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const displayedLines = engineLines.filter(line => line.depth == depth);

    useEffect(() => {
        if (evaluationDelayRef.current) {
            clearTimeout(evaluationDelayRef.current);
        }

        engine.stopEvaluation();

        evaluationDelayRef.current = setTimeout(() => {
            engine.setLineCount(settings.analysis.engineLines);
            engine.setPosition(fen);

            engine.evaluate(
                settings.analysis.engineDepth,
                (depth, lines) => {
                    setDepth(depth);
                    setEngineLines(lines);
                }
            );
        }, 500);
    }, [fen]);

    return <div className={styles.wrapper}>
        <span className={styles.depth}>
            {`${t("pages.analysis.engineLines.depth")} ${depth}`}
        </span>

        {
            displayedLines.map((line, index) => <>
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