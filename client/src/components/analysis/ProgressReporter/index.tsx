import React from "react";
import { useTranslation } from "react-i18next";

import useAnalysisProgressStore from "@stores/AnalysisProgressStore";

import * as styles from "./ProgressReporter.module.css";

function ProgressReporter() {
    const { t } = useTranslation();

    const { analysisProgress } = useAnalysisProgressStore();

    return <div className={styles.wrapper}>
        <div className={styles.info}>
            <span>
                {t("pages.analysis.progressReporter.analysing")}
            </span>

            <span>
                {(analysisProgress * 100).toFixed(1) + "%"}
            </span>
        </div>

        <progress
            className={styles.progress}
            value={analysisProgress}
        />
    </div>;
}

export default ProgressReporter;