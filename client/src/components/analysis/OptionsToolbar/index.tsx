import React from "react";
import { useTranslation } from "react-i18next";

import useAnalysisGameStore from "@stores/AnalysisGameStore";
import Button from "@components/common/Button";

import * as styles from "./OptionsToolbar.module.css";

function OptionsToolbar() {
    const { t } = useTranslation();

    const {
        gameAnalysisOpen,
        setGameAnalysisOpen
    } = useAnalysisGameStore();

    return <div className={styles.wrapper}>
        {
            (gameAnalysisOpen || true)
            && <Button
                icon={require("@assets/img/back.svg")}
                iconSize={"40px"}
                className={styles.backButton}
                tooltip={t("back")}
                onClick={() => setGameAnalysisOpen(false)}
            />
        }

        <Button
            className={styles.optionButton}
            icon={require("@assets/img/flip.svg")}
            iconSize={"40px"}
            tooltip={t("pages.analysis.options.flipBoard")}
            onClick={() => console.log("board flip! kawaii!!")}
        />

        <Button
            className={styles.optionButton}
            icon={require("@assets/img/settings.svg")}
            iconSize={"35px"}
            tooltip={t("settings")}
            onClick={() => console.log("settings! kawaii!!")}
        />

        <Button
            className={styles.optionButton}
            icon={require("@assets/img/share.svg")}
            iconSize={"35px"}
            tooltip={t("pages.analysis.options.share")}
            onClick={() => console.log("share! kawaii!!")}
        />
    </div>;
}

export default OptionsToolbar;