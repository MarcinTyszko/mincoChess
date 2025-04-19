import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import BoardAndPieces from "./categories/BoardAndPieces";
import OpenBeta from "./categories/BugReporting";

import CategoryTab from "./CategoryTab";
import * as styles from "./Settings.module.css";

enum SettingsCategory {
    BOARD_AND_PIECES,
    OPEN_BETA,
    CONTACT
}

function Settings() {
    const { t } = useTranslation();

    const navigate = useNavigate(); 

    const [ openCategory, setOpenCategory ] = useState(
        SettingsCategory.BOARD_AND_PIECES
    );

    return <div className={styles.wrapper}>
        <div className={styles.titleContainer}>
            <img src={require("@assets/img/icons/settings.png")} />

            <span>
                {t("pages.settings.title")}
            </span>
        </div>

        <div className={styles.settingsContainer}>
            <div>
                {
                    openCategory == SettingsCategory.BOARD_AND_PIECES
                    && <BoardAndPieces/>
                }

                {
                    openCategory == SettingsCategory.OPEN_BETA
                    && <OpenBeta/>
                }
            </div>

            <div className={styles.categories}>
                <CategoryTab
                    active={openCategory == SettingsCategory.BOARD_AND_PIECES}
                    onClick={() => (
                        setOpenCategory(SettingsCategory.BOARD_AND_PIECES)
                    )}
                >
                    {t("pages.settings.categories.boardAndPieces.title")}
                </CategoryTab>

                <CategoryTab
                    active={openCategory == SettingsCategory.OPEN_BETA}
                    onClick={() => (
                        setOpenCategory(SettingsCategory.OPEN_BETA)
                    )}
                >
                    {t("pages.settings.categories.bugReporting.title")}
                </CategoryTab>

                <hr className={styles.separator} />

                <CategoryTab
                    onClick={() => navigate("/help")}
                >
                    {t("pages.helpCenter.title")}
                </CategoryTab>
            </div>
        </div>
    </div>;
}

export default Settings;