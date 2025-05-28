import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import CategoryTab from "@apps/settings/components/CategoryTab";
import BoardAndPieces from "./categories/BoardAndPieces";
import BugReporting from "./categories/BugReporting";
import { manageDataConsent } from "@lib/consent";

import * as styles from "./Settings.module.css";

enum SettingsCategory {
    BOARD_AND_PIECES,
    BUG_REPORTING
}

function Settings() {
    const { t } = useTranslation();

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
                {openCategory == SettingsCategory.BOARD_AND_PIECES
                    && <BoardAndPieces/>
                }

                {openCategory == SettingsCategory.BUG_REPORTING
                    && <BugReporting/>
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
                    active={openCategory == SettingsCategory.BUG_REPORTING}
                    onClick={() => setOpenCategory(
                        SettingsCategory.BUG_REPORTING
                    )}
                >
                    {t("pages.settings.categories.bugReporting.title")}
                </CategoryTab>

                <hr className={styles.separator} />

                <CategoryTab onClick={manageDataConsent}>
                    {t("pages.settings.categories.privacy")}
                </CategoryTab>

                <CategoryTab onClick={() => {
                    location.href = "/help";
                }}>
                    {t("pages.helpCenter.title")}
                </CategoryTab>
            </div>
        </div>
    </div>;
}

export default Settings;