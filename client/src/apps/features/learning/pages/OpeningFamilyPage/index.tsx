import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chess } from "chess.js";
import { Square } from "react-chessboard/dist/chessboard/types";

import {
    OpeningVariation,
    getOpeningFamily,
    getVariationId
} from "shared/lib/learning/catalog";
import PieceColour, { adaptPieceColour } from "shared/constants/PieceColour";
import useLearningProgressStore from "@/stores/LearningProgressStore";
import useLessonStore, {
    LessonMode,
    LessonStatus,
    MoveVerdict,
    getExpectedMove
} from "@learning/stores/LessonStore";
import LearningBoard from "@learning/components/LearningBoard";

import * as styles from "./OpeningFamilyPage.module.css";

const HINT_PIECE_COLOUR = "rgba(240, 201, 108, 0.65)";
const HINT_TARGET_COLOUR = "rgba(127, 215, 127, 0.65)";

function getVariationLabel(variation: OpeningVariation) {
    const subname = variation.name.split(":").slice(1).join(":").trim();

    return subname || undefined;
}

function OpeningFamilyPage() {
    const { t } = useTranslation("learning");

    const params = useParams<{ family: string }>();

    const family = useMemo(() => (
        getOpeningFamily(decodeURIComponent(params.family || ""))
    ), [params.family]);

    const {
        favourites,
        completed,
        toggleFavourite,
        syncWithServer
    } = useLearningProgressStore();

    const {
        lesson,
        startLesson,
        tryMove,
        requestHint,
        stopLesson
    } = useLessonStore();

    const [ playerColour, setPlayerColour ] = useState(
        family?.learnerColour || PieceColour.WHITE
    );

    useEffect(() => {
        syncWithServer();

        return () => stopLesson();
    }, []);

    const completedSet = useMemo(() => new Set(completed), [completed]);

    const previewFen = useMemo(() => {
        const board = new Chess();

        for (const san of family?.mainLine.moves || []) {
            board.move(san);
        }

        return board.fen();
    }, [family]);

    if (!family) {
        return <div className={styles.unfound}>
            {t("family.notFound")}

            <Link to="/learning">{t("family.backToCatalog")}</Link>
        </div>;
    }

    const favourite = favourites.includes(family.name);

    const expectedMove = lesson && getExpectedMove(lesson);

    const playerToMove = lesson && adaptPieceColour(
        new Chess(lesson.fen).turn()
    ) == lesson.playerColour;

    // Hint square highlights and the full solution arrow
    const highlightedSquares: Partial<Record<Square, string>> = {};
    let arrows: [Square, Square][] | undefined;

    if (lesson && expectedMove && playerToMove) {
        if (lesson.hintLevel >= 1) {
            highlightedSquares[expectedMove.from as Square]
                = HINT_PIECE_COLOUR;
        }

        if (lesson.hintLevel >= 2) {
            highlightedSquares[expectedMove.to as Square]
                = HINT_TARGET_COLOUR;
            arrows = [[
                expectedMove.from as Square,
                expectedMove.to as Square
            ]];
        }
    }

    // The learner's own progress through the practised line
    const playerParity = lesson?.playerColour == PieceColour.WHITE ? 0 : 1;

    function countPlayerPlies(untilPly: number) {
        if (!lesson) return 0;

        let count = 0;

        for (let ply = lesson.startPly; ply < untilPly; ply++) {
            if (ply % 2 == playerParity) count++;
        }

        return count;
    }

    function startRandomChallenge() {
        if (!family) return;

        const pool = family.variations.filter(
            variation => !completedSet.has(getVariationId(variation))
        );

        const candidates = pool.length > 0 ? pool : family.variations;

        const variation = candidates[
            Math.floor(Math.random() * candidates.length)
        ];

        startLesson(
            family.name, variation, LessonMode.CHALLENGE, playerColour
        );
    }

    return <div className={styles.wrapper}>
        <div className={styles.boardArea}>
            <LearningBoard
                fen={lesson?.fen || previewFen}
                flipped={playerColour == PieceColour.BLACK}
                interactive={!!lesson}
                highlightedSquares={highlightedSquares}
                arrows={arrows}
                onMove={(from, to) => (
                    tryMove(from, to) == MoveVerdict.CORRECT
                )}
            />
        </div>

        <div className={styles.panel}>
            <Link className={styles.backLink} to="/learning">
                ← {t("family.backToCatalog")}
            </Link>

            <div className={styles.titleRow}>
                <span className={styles.eco}>{family.eco}</span>

                <h1 className={styles.title}>{family.name}</h1>

                <button
                    className={styles.favouriteButton}
                    data-active={favourite}
                    title={t("catalog.favouriteTooltip")}
                    onClick={() => toggleFavourite(family.name)}
                >
                    {favourite ? "★" : "☆"}
                </button>
            </div>

            <div className={styles.description}>
                {t(`descriptions.${family.name}`, {
                    defaultValue: t("family.defaultDescription", {
                        moves: family.mainLine.moves.slice(0, 6).join(" "),
                        count: family.variations.length
                    })
                })}
            </div>

            <div className={styles.controlsRow}>
                <div className={styles.sideToggle}>
                    <span>{t("family.playAs")}</span>

                    {[PieceColour.WHITE, PieceColour.BLACK].map(colour => (
                        <button
                            key={colour}
                            className={styles.sideButton}
                            data-active={playerColour == colour}
                            onClick={() => {
                                setPlayerColour(colour);
                                stopLesson();
                            }}
                        >
                            {t(`family.${colour}`)}
                        </button>
                    ))}
                </div>

                <button
                    className={styles.challengeButton}
                    onClick={startRandomChallenge}
                >
                    🎲 {t("family.randomChallenge")}
                </button>
            </div>

            {lesson && <div className={styles.lessonPanel}>
                <div className={styles.lessonHeader}>
                    <span className={styles.lessonMode}>
                        {t(`lesson.mode.${lesson.mode}`)}
                    </span>

                    <span className={styles.lessonVariation}>
                        {getVariationLabel(lesson.variation)
                            || t("family.mainLine")}
                    </span>
                </div>

                {lesson.status == LessonStatus.ACTIVE && <>
                    <div className={styles.lessonProgress}>
                        {t("lesson.progress", {
                            current: countPlayerPlies(lesson.plyIndex),
                            total: countPlayerPlies(lesson.line.length)
                        })}
                    </div>

                    {lesson.lastVerdict == MoveVerdict.WRONG
                        && <div className={styles.wrongFeedback}>
                            {t("lesson.wrongMove")}

                            {lesson.hintLevel == 1 && <div>
                                {t("lesson.hintPiece")}
                            </div>}

                            {lesson.hintLevel >= 2 && <div>
                                {t("lesson.hintSolution", {
                                    move: expectedMove?.san
                                })}
                            </div>}
                        </div>
                    }

                    {lesson.lastVerdict == MoveVerdict.CORRECT
                        && lesson.hintLevel == 0
                        && <div className={styles.correctFeedback}>
                            {t("lesson.correctMove")}
                        </div>
                    }

                    {playerToMove && <div className={styles.lessonPrompt}>
                        {t("lesson.yourMove")}
                    </div>}

                    <div className={styles.lessonButtons}>
                        <button
                            className={styles.hintButton}
                            onClick={requestHint}
                        >
                            💡 {lesson.hintLevel == 0
                                ? t("lesson.hintButton")
                                : t("lesson.solutionButton")
                            }
                        </button>

                        <button
                            className={styles.stopButton}
                            onClick={stopLesson}
                        >
                            {t("lesson.stopButton")}
                        </button>
                    </div>
                </>}

                {lesson.status == LessonStatus.COMPLETED && <>
                    <div className={styles.completedBox}>
                        🎉 {t("lesson.completed")}
                    </div>

                    <div className={styles.lessonButtons}>
                        <button
                            className={styles.challengeButton}
                            onClick={startRandomChallenge}
                        >
                            {t("lesson.nextChallenge")}
                        </button>

                        <button
                            className={styles.stopButton}
                            onClick={stopLesson}
                        >
                            {t("lesson.closeButton")}
                        </button>
                    </div>
                </>}
            </div>}

            <h2 className={styles.variationsTitle}>
                {t("family.variations", {
                    count: family.variations.length
                })}
            </h2>

            <div className={styles.variationList}>
                {family.variations.map(variation => {
                    const variationId = getVariationId(variation);
                    const isCompleted = completedSet.has(variationId);

                    return <div
                        key={variationId}
                        className={styles.variationRow}
                        data-completed={isCompleted}
                    >
                        <span className={styles.variationCheck}>
                            {isCompleted ? "✅" : "⬜"}
                        </span>

                        <div className={styles.variationInfo}>
                            <span className={styles.variationName}>
                                {getVariationLabel(variation)
                                    || t("family.mainLine")}
                            </span>

                            <span className={styles.variationMoves}>
                                {variation.moves.join(" ")}
                            </span>
                        </div>

                        <div className={styles.variationButtons}>
                            <button
                                className={styles.learnButton}
                                onClick={() => startLesson(
                                    family.name,
                                    variation,
                                    LessonMode.LEARN,
                                    playerColour
                                )}
                            >
                                {t("family.learnButton")}
                            </button>

                            <button
                                className={styles.taskButton}
                                onClick={() => startLesson(
                                    family.name,
                                    variation,
                                    LessonMode.CHALLENGE,
                                    playerColour
                                )}
                            >
                                {t("family.challengeButton")}
                            </button>
                        </div>
                    </div>;
                })}
            </div>
        </div>
    </div>;
}

export default OpeningFamilyPage;
