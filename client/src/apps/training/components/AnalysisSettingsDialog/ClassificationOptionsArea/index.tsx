import React from "react";
import { useTranslation } from "react-i18next";

import useSettingsStore from "@stores/SettingsStore";
import CheckboxSetting from "@components/settings/CheckboxSetting";

import * as styles from "../AnalysisSettingsDialog.module.css";

function ClassificationOptionsArea() {
    const { t } = useTranslation();

    const { settings, setSettings } = useSettingsStore();

    return <>
        <span className={styles.header}>
            {t("pages.analysis.settings.classifications.title")}
        </span>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.classifications.hide")}</span>

            <CheckboxSetting
                defaultChecked={settings.analysis.classifications.hide}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.hide = checked;
                        return draft;
                    })
                )}
            />
        </div>

        <div className={styles.setting}>
            <div className={styles.subsetting}>
                <img
                    className={styles.settingIcon}
                    src={require("@assets/img/classifications/brilliant.png")}
                />

                <span>
                    {t("pages.analysis.settings.classifications.brilliant")}
                </span>
            </div>

            <CheckboxSetting
                defaultChecked={
                    settings.analysis.classifications.included.brilliant
                }
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.included.brilliant = checked;
                        return draft;
                    })
                )}
            />
        </div>

        <div className={styles.setting}>
            <div className={styles.subsetting}>
                <img
                    className={styles.settingIcon}
                    src={require("@assets/img/classifications/theory.png")}
                />

                <span>
                    {t("pages.analysis.settings.classifications.theory")}
                </span>
            </div>

            <CheckboxSetting
                defaultChecked={settings.analysis.classifications.included.theory}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.included.theory = checked;
                        return draft;
                    })
                )}
            />
        </div>
    </>;
}

export default ClassificationOptionsArea;