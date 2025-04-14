import React from "react";

import ErrorMessage from "@components/common/ErrorMessage";

import ProgressReporterProps from "./ProgressReporterProps";
import * as styles from "./ProgressReporter.module.css";

function ProgressReporter({
    progress,
    title,
    tooltip,
    error
}: ProgressReporterProps) {
    return <div className={styles.wrapper}>
        <div className={styles.info}>
            {title && <span>{title}</span>}

            <span>
                {(progress * 100).toFixed(1)}%
            </span>
        </div>

        <progress
            className={styles.progress}
            value={progress}
        />

        {
            tooltip
            && <span className={styles.tooltip}>
                {tooltip}
            </span>
        }

        {
            error
            && <ErrorMessage>
                {error}
            </ErrorMessage>
        }
    </div>;
}

export default ProgressReporter;