import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
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
                    icon={require("@assets/img/interface/back.svg")}
                    iconSize={"40px"}
                    className={styles.backButton}
                    tooltip={t("back")}
                    onClick={() => location.reload()}
                />
            }

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/interface/flip.svg")}
                iconSize={"40px"}
                tooltip={t("pages.analysis.options.flipBoard")}
                onClick={() => setBoardFlipped(!boardFlipped)}
            />

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/interface/settings.svg")}
                iconSize={"35px"}
                tooltip={t("settings")}
                onClick={() => setSettingsOpen(true)}
            />

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/interface/share.svg")}
                iconSize={"35px"}
                tooltip={t("pages.analysis.options.share")}
                onClick={() => toast.info(
                    t("pages.analysis.options.sharingSoon"),
                    {
                        position: "bottom-left",
                        theme: "dark",
                        pauseOnHover: false,
                        closeOnClick: true,
                        closeButton: false,
                        autoClose: 2000,
                        style: {
                            fontFamily: "JetBrains Mono"
                        }
                    }
                )}
            />
        </div>

        {
            settingsOpen
            && <AnalysisSettingsDialog setOpen={setSettingsOpen} />
        }
    </>;
}

export default OptionsToolbar;