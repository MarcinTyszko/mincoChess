import React from "react";
import { useTranslation } from "react-i18next";

import AccuraciesCardProps from "./AccuraciesCardProps";
import * as styles from "./AccuraciesCard.module.css";

function AccuraciesCard({ accuracies, estimatedRatings }: AccuraciesCardProps) {
    const { t } = useTranslation("analysis");

    return <div className={styles.wrapper}>
        <div className={styles.accuraciesTitle}>
            {t("accuraciesCard.title")}
        </div>

        <div className={styles.accuracies}>
            <div className={`${styles.accuracy} ${styles.whiteAccuracy}`}>
                {accuracies.white
                    ? accuracies.white.toFixed(1) + "%"
                    : "N/A"
                }

                {estimatedRatings && <div className={styles.estimatedRating}>
                    {t("accuraciesCard.estimatedRating", {
                        rating: estimatedRatings.white
                    })}
                </div>}
            </div>

            <div className={`${styles.accuracy} ${styles.blackAccuracy}`}>
                {accuracies.black
                    ? accuracies.black.toFixed(1) + "%"
                    : "N/A"
                }

                {estimatedRatings && <div className={styles.estimatedRating}>
                    {t("accuraciesCard.estimatedRating", {
                        rating: estimatedRatings.black
                    })}
                </div>}
            </div>
        </div>
    </div>;
}

export default AccuraciesCard;
