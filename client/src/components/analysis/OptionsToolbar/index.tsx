import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import Button from "@components/common/Button";
import AnalysisSettingsDialog from "../AnalysisSettingsDialog";

import * as styles from "./OptionsToolbar.module.css";

function OptionsToolbar() {
    const { t } = useTranslation();

    const { gameAnalysisOpen } = useAnalysisGameStore();

    const {
        boardFlipped,
        setBoardFlipped
    } = useAnalysisBoardStore();

    const [ settingsOpen, setSettingsOpen ] = useState(false);

    return <>
        <div className={styles.wrapper}>
            {
                gameAnalysisOpen
                && <Button
                    icon={require("@assets/img/back.svg")}
                    iconSize={"40px"}
                    className={styles.backButton}
                    tooltip={t("back")}
                    onClick={() => location.reload()}
                />
            }

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/flip.svg")}
                iconSize={"40px"}
                tooltip={t("pages.analysis.options.flipBoard")}
                onClick={() => setBoardFlipped(!boardFlipped)}
            />

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/settings.svg")}
                iconSize={"35px"}
                tooltip={t("settings")}
                onClick={() => setSettingsOpen(true)}
            />

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/share.svg")}
                iconSize={"35px"}
                tooltip={t("pages.analysis.options.share")}
                onClick={() => console.log("share! kawaii!!")}
            />
        </div>

        {
            settingsOpen
            && <AnalysisSettingsDialog setOpen={setSettingsOpen} />
        }
    </>;
}

export default OptionsToolbar;