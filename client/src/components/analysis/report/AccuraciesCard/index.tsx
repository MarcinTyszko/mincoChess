import React from "react";
import { useTranslation } from "react-i18next";

import AccuraciesCardProps from "./AccuraciesCardProps";
import * as styles from "./AccuraciesCard.module.css";

function AccuraciesCard({ accuracies, estimatedRatings }: AccuraciesCardProps) {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <div className={styles.accuraciesTitle}>
            {t("pages.analysis.accuraciesCard.title")}
        </div>

        <div className={styles.accuracies}>
            <div className={`${styles.accuracy} ${styles.whiteAccuracy}`}>
                {accuracies.white.toFixed(1)}%
            </div>

            <div className={`${styles.accuracy} ${styles.blackAccuracy}`}>
                {accuracies.black.toFixed(1)}%
            </div>
        </div>
    </div>;
}

export default AccuraciesCard;