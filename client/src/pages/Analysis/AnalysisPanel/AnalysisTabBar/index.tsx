import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@components/common/Button";

import AnalysisTabBarProps from "./AnalysisTabBarProps";
import * as styles from "./AnalysisTabBar.module.css";

export enum AnalysisTab {
    REPORT,
    ANALYSIS
}

function AnalysisTabBar({ activeTab, onTabSelect }: AnalysisTabBarProps) {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <Button
            className={
                `${styles.button} ${styles.reportButton} `
                + (activeTab == AnalysisTab.REPORT ? styles.selectedButton : "")
            }
            onClick={() => onTabSelect(AnalysisTab.REPORT)}
        >
            {t("pages.analysis.analysisTabBar.report")}
        </Button>

        <Button
            className={
                `${styles.button} ${styles.analysisButton} `
                + (activeTab == AnalysisTab.ANALYSIS ? styles.selectedButton : "")
            }
            onClick={() => onTabSelect(AnalysisTab.ANALYSIS)}
        >
            {t("pages.analysis.analysisTabBar.analysis")}
        </Button>
    </div>;
}

export default AnalysisTabBar;