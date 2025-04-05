import React from "react";
import { useTranslation } from "react-i18next";

import AnalysisTab from "@constants/AnalysisTab";
import useAnalysisTabStore from "@stores/analysis/AnalysisTabStore";
import Button from "@components/common/Button";

import * as styles from "./AnalysisTabBar.module.css";

function AnalysisTabBar() {
    const { t } = useTranslation();

    const { activeTab, setActiveTab } = useAnalysisTabStore();

    return <div className={styles.wrapper}>
        <Button
            className={
                `${styles.button} ${styles.reportButton} `
                + (activeTab == AnalysisTab.REPORT ? styles.selectedButton : "")
            }
            onClick={() => setActiveTab(AnalysisTab.REPORT)}
        >
            {t("pages.analysis.analysisTabBar.report")}
        </Button>

        <Button
            className={
                `${styles.button} ${styles.analysisButton} `
                + (activeTab == AnalysisTab.ANALYSIS ? styles.selectedButton : "")
            }
            onClick={() => setActiveTab(AnalysisTab.ANALYSIS)}
        >
            {t("pages.analysis.analysisTabBar.analysis")}
        </Button>
    </div>;
}

export default AnalysisTabBar;