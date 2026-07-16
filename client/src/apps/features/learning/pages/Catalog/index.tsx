import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    OpeningFamily,
    getOpeningFamilies,
    getVariationId
} from "shared/lib/learning/catalog";
import { getStreaks } from "shared/lib/learning/streaks";
import useLearningProgressStore from "@/stores/LearningProgressStore";

import * as styles from "./Catalog.module.css";

interface FamilyCardProps {
    family: OpeningFamily;
    completedCount: number;
    favourite: boolean;
    onToggleFavourite: () => void;
}

function FamilyCard({
    family,
    completedCount,
    favourite,
    onToggleFavourite
}: FamilyCardProps) {
    const { t } = useTranslation("learning");

    const progressPercent = Math.round(
        100 * completedCount / family.variations.length
    );

    return <div className={styles.familyCard}>
        <div className={styles.familyCardHeader}>
            <span className={styles.familyEco}>{family.eco}</span>

            <button
                className={styles.favouriteButton}
                data-active={favourite}
                title={t("catalog.favouriteTooltip")}
                onClick={onToggleFavourite}
            >
                {favourite ? "★" : "☆"}
            </button>
        </div>

        <Link
            className={styles.familyName}
            to={`/learning/opening/${encodeURIComponent(family.name)}`}
        >
            {family.name}
        </Link>

        <div className={styles.familyMoves}>
            {family.mainLine.moves.slice(0, 8).join(" ")}
        </div>

        <div className={styles.familyProgressLabel}>
            {t("catalog.variationsProgress", {
                completed: completedCount,
                total: family.variations.length
            })}
        </div>

        <div className={styles.progressTrack}>
            <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
            />
        </div>
    </div>;
}

function Catalog() {
    const { t } = useTranslation("learning");

    const [ search, setSearch ] = useState("");

    const {
        favourites,
        completed,
        activity,
        toggleFavourite,
        syncWithServer
    } = useLearningProgressStore();

    useEffect(() => {
        syncWithServer();
    }, []);

    const completedSet = useMemo(() => new Set(completed), [completed]);

    const families = useMemo(() => {
        const query = search.trim().toLowerCase();

        return getOpeningFamilies().filter(family => (
            !query || family.name.toLowerCase().includes(query)
        ));
    }, [search]);

    const favouriteFamilies = families.filter(
        family => favourites.includes(family.name)
    );

    const otherFamilies = families.filter(
        family => !favourites.includes(family.name)
    );

    const streaks = getStreaks(activity);

    function getCompletedCount(family: OpeningFamily) {
        return family.variations.filter(
            variation => completedSet.has(getVariationId(variation))
        ).length;
    }

    function renderCards(families: OpeningFamily[]) {
        return <div className={styles.familyGrid}>
            {families.map(family => <FamilyCard
                key={family.name}
                family={family}
                completedCount={getCompletedCount(family)}
                favourite={favourites.includes(family.name)}
                onToggleFavourite={() => toggleFavourite(family.name)}
            />)}
        </div>;
    }

    return <div className={styles.wrapper}>
        <div className={styles.header}>
            <h1 className={styles.title}>{t("catalog.title")}</h1>

            {streaks.current > 0 && <span
                className={styles.streakChip}
                title={t("stats.longestStreak", {
                    count: streaks.longest
                })}
            >
                🔥 {t("stats.currentStreak", { count: streaks.current })}
            </span>}
        </div>

        <div className={styles.subtitle}>{t("catalog.subtitle")}</div>

        <input
            className={styles.search}
            placeholder={t("catalog.searchPlaceholder")}
            value={search}
            onChange={event => setSearch(event.target.value)}
        />

        {favouriteFamilies.length > 0 && <>
            <h2 className={styles.sectionTitle}>
                ★ {t("catalog.favouritesSection")}
            </h2>

            {renderCards(favouriteFamilies)}
        </>}

        <h2 className={styles.sectionTitle}>
            {t("catalog.allSection")}
        </h2>

        {otherFamilies.length > 0
            ? renderCards(otherFamilies)
            : <div className={styles.emptyState}>
                {t("catalog.noResults")}
            </div>
        }
    </div>;
}

export default Catalog;
