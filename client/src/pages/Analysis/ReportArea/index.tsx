import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { round } from "lodash";

import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useGameSelectorStore from "@stores/GameSelectorStore";
import useLayoutStore from "@stores/LayoutStore";
import GameSelector from "@components/analysis/GameSelector";
import OptionsToolbar from "@components/analysis/OptionsToolbar";
import StateTreeEditor from "@components/analysis/StateTreeEditor";
import StateTreeTraverser from "@components/analysis/StateTreeTraverser";
import Button from "@components/common/Button";
import Breakpoints from "@constants/Breakpoints";
import playBoardSound from "@lib/boardSounds";

import useAnalysis from "../useAnalysis";
import * as styles from "./ReportArea.module.css";

function ReportArea() {
    const { t } = useTranslation();

    const { contentSectionHeight } = useLayoutStore();

    const {
        setSelectedGame,
        setGameSelectorError
    } = useGameSelectorStore();

    const {
        analysisGame,
        gameAnalysisOpen
    } = useAnalysisGameStore();

    const {
        setCurrentStateTreeNode,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const [ analysisProgress, setAnalysisProgress ] = useState(0);
    const [ analysisError, setAnalysisError ] = useState<string | null>(null);

    const analyse = useAnalysis(setAnalysisError, setAnalysisProgress);
    
    return <div
        className={styles.reportContainer}
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

        {
            !gameAnalysisOpen
            && <>
                <GameSelector
                    saveCookies
                    onChange={setSelectedGame}
                    setError={setGameSelectorError}
                />

                <Button
                    icon={require("@assets/img/analysis.svg")}
                    iconSize="30px"
                    style={{
                        fontSize: "1.1rem"
                    }}
                    onClick={analyse}
                >
                    {t("pages.analysis.analyseButton")}
                </Button>
            </>
        }

        {
            analysisError
            && <span className={styles.error}>
                {analysisError}
            </span>
        }

        {
            gameAnalysisOpen
            && <>
                <span style={{ color: "white" }}>
                    PROGRESS: {round(analysisProgress * 100, 1)}%
                </span>

                <StateTreeEditor
                    className={styles.stateTreeEditor}
                    stateTreeRootNode={analysisGame.stateTree}
                    onMoveClick={node => {
                        setCurrentStateTreeNode(node);

                        playBoardSound(node);

                        setAutoplayEnabled(false);
                    }}
                />
            </>
        }

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

export default ReportArea;