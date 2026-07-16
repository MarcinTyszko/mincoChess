import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { getStreaks } from "shared/lib/learning/streaks";
import useLearningProgressStore from "@/stores/LearningProgressStore";
import ActivityHeatmap from "@/components/learning/ActivityHeatmap";

import * as styles from "./LearningStatsCard.module.css";

/**
 * @description Gamified learning summary: GitHub-style activity tiles,
 * current/longest streaks and overall lesson progress.
 */
function LearningStatsCard() {
    const { t } = useTranslation("learning");

    const {
        favourites,
        completed,
        activity,
        syncWithServer
    } = useLearningProgressStore();

    useEffect(() => {
        syncWithServer();
    }, []);

    const streaks = getStreaks(activity);

    const stats = [
        {
            icon: "🔥",
            value: streaks.current,
            label: t("stats.currentStreakLabel")
        },
        {
            icon: "🏆",
            value: streaks.longest,
            label: t("stats.longestStreakLabel")
        },
        {
            icon: "✅",
            value: completed.length,
            label: t("stats.completedLabel")
        },
        {
            icon: "★",
            value: favourites.length,
            label: t("stats.favouritesLabel")
        }
    ];

    return <div className={styles.wrapper}>
        <div className={styles.title}>{t("stats.title")}</div>

        <div className={styles.statsRow}>
            {stats.map(stat => <div
                key={stat.label}
                className={styles.stat}
            >
                <span className={styles.statValue}>
                    {stat.icon} {stat.value}
                </span>

                <span className={styles.statLabel}>{stat.label}</span>
            </div>)}
        </div>

        <ActivityHeatmap activity={activity} />

        <a className={styles.learningLink} href="/learning">
            {t("stats.goToLearning")} →
        </a>
    </div>;
}

export default LearningStatsCard;
