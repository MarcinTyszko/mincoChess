import React from "react";
import { useTranslation } from "react-i18next";

import ErrorMessage from "@components/common/ErrorMessage";

import ProgressReporterProps from "./ProgressReporterProps";
import * as styles from "./ProgressReporter.module.css";

function ProgressReporter({ progress, error }: ProgressReporterProps) {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <div className={styles.info}>
            <span>
                {t("pages.analysis.progressReporter.analysing")}
            </span>

            <span>
                {(progress * 100).toFixed(1)}%
            </span>
        </div>

        <progress
            className={styles.progress}
            value={progress}
        />

        {
            error
                ? <ErrorMessage>
                    {error}
                </ErrorMessage>
                : <span className={styles.tooltip}>
                    {t("pages.analysis.progressReporter.tooltip")}
                </span>
        }
    </div>;
}

export default ProgressReporter;