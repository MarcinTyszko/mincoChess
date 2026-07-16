import React, { useEffect, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import { findNodeRecursively } from "shared/types/game/position/StateTreeNode";
import {
    OpeningDeviation,
    getBookLine
} from "shared/lib/reporter/utils/theoryDeviation";
import {
    getOpeningFamily,
    getOpeningFamilyName
} from "shared/lib/learning/catalog";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useOpeningLesson from "@analysis/hooks/useOpeningLesson";
import { LessonStatus } from "@analysis/stores/OpeningLessonStore";
import useLearningProgressStore from "@/stores/LearningProgressStore";

import * as styles from "./OpeningLessonCard.module.css";

interface OpeningLessonCardProps {
    deviation: OpeningDeviation;
}

function OpeningLessonCard({ deviation }: OpeningLessonCardProps) {
    const { t } = useTranslation("analysis");

    const analysisGame = useAnalysisGameStore(
        state => state.analysisGame
    );

    const {
        setCurrentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const { lesson, startLesson, stopLesson } = useOpeningLesson();

    const {
        favourites,
        toggleFavourite,
        syncWithServer
    } = useLearningProgressStore();

    useEffect(() => {
        syncWithServer();
    }, []);

    const bookLine = useMemo(() => (
        getBookLine(deviation.parentFen)
    ), [deviation]);

    const learningFamily = useMemo(() => (
        getOpeningFamily(
            getOpeningFamilyName(deviation.openingName)
        )
    ), [deviation]);

    const favourite = !!learningFamily
        && favourites.includes(learningFamily.name);

    const correctMove = bookLine.at(0)?.san
        || deviation.bookMoves[0].san;

    const lessonHere = lesson?.deviation.nodeId == deviation.nodeId
        ? lesson : undefined;

    function showDeviation() {
        const deviationNode = findNodeRecursively(
            analysisGame.stateTree,
            node => node.id == deviation.nodeId
        );

        if (!deviationNode) return;

        setCurrentStateTreeNode(deviationNode);
        dispatchCurrentNodeUpdate();
    }

    const playerMoveCount = Math.ceil(lessonHere
        ? lessonHere.line.length / 2 : 0);

    const playerMovesPlayed = Math.ceil(lessonHere
        ? lessonHere.progress / 2 : 0);

    return <div className={styles.wrapper}>
        <div className={styles.titleRow}>
            <div className={styles.title}>
                {t("openingLesson.title")}
            </div>

            {learningFamily && <button
                className={styles.favouriteButton}
                data-active={favourite}
                title={t("openingLesson.favouriteTooltip")}
                onClick={() => toggleFavourite(learningFamily.name)}
            >
                {favourite ? "★" : "☆"}
            </button>}
        </div>

        <div className={styles.deviationText} onClick={showDeviation}>
            <Trans
                t={t}
                i18nKey={"openingLesson.deviationText"}
                values={{
                    player: t(`openingLesson.${deviation.colour}`),
                    opening: deviation.openingName,
                    played: deviation.playedMoveSan,
                    move: correctMove
                }}
                components={{
                    opening: <span className={styles.openingName} />,
                    played: <span className={styles.playedMove} />,
                    move: <span className={styles.correctMove} />
                }}
            />
        </div>

        {!lessonHere && <button
            className={styles.practiceButton}
            onClick={() => startLesson(deviation, bookLine)}
        >
            {t("openingLesson.practiceButton")}
        </button>}

        {lessonHere?.status == LessonStatus.ACTIVE && <>
            <div className={styles.progress}>
                {t("openingLesson.progress", {
                    current: playerMovesPlayed,
                    total: playerMoveCount
                })}
            </div>

            <button
                className={`${styles.practiceButton} ${styles.stopButton}`}
                onClick={stopLesson}
            >
                {t("openingLesson.stopButton")}
            </button>
        </>}

        {lessonHere?.status == LessonStatus.COMPLETED && <>
            <div className={styles.completed}>
                {t("openingLesson.completed")}
            </div>

            <button
                className={`${styles.practiceButton} ${styles.stopButton}`}
                onClick={stopLesson}
            >
                {t("openingLesson.closeButton")}
            </button>
        </>}

        {learningFamily && <a
            className={styles.learningLink}
            href={`/learning/opening/${
                encodeURIComponent(learningFamily.name)
            }`}
        >
            📖 {t("openingLesson.learningLink", {
                opening: learningFamily.name
            })} →
        </a>}
    </div>;
}

export default OpeningLessonCard;
