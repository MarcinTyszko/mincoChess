import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import Breakpoints from "@constants/Breakpoints";
import OptionsToolbar from "@components/analysis/OptionsToolbar";
import StateTreeTraverser from "@components/analysis/StateTreeTraverser";

import AnalysisProgressContext from "./AnalysisProgressContext";
import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import * as styles from "./AnalysisPanel.module.css";

function AnalysisPanel() {
    const { t } = useTranslation();

    const { contentSectionHeight } = useLayoutStore();

    const { gameAnalysisOpen } = useAnalysisGameStore();

    const [ analysisProgress, setAnalysisProgress ] = useState(0);
    
    return <div
        className={styles.wrapper}
        style={{
            height: innerWidth > Breakpoints.MOBILE_LAYOUT
                ? `${contentSectionHeight}px`
                : undefined
        }}
    >
        <div className={styles.title}>
            {t("pages.analysis.title")}
        </div>

        <OptionsToolbar/>

        <AnalysisProgressContext.Provider
            value={{
                analysisProgress: analysisProgress,
                setAnalysisProgress: setAnalysisProgress
            }}
        >
            {
                gameAnalysisOpen
                    ? <GameReport/>
                    : <GameSelection/>
            }
        </AnalysisProgressContext.Provider>

        <StateTreeTraverser
            style={{
                position: "fixed",
                bottom: "10px",
                right: innerWidth > Breakpoints.MOBILE_LAYOUT
                    ? "10px"
                    : `calc(50vw - (${innerWidth > 400 ? 365 : 280}px / 2))`
            }}
        />

        <div className={styles.stateTreeTraverserPlaceholder} />
    </div>;
}

export default AnalysisPanel;