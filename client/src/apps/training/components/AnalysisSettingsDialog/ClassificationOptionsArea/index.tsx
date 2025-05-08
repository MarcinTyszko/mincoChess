import React from "react";
import { useTranslation } from "react-i18next";
import { produce } from "immer";

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
                defaultChecked={settings.analysis.hideClassifications}
                onChange={checked => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.hideClassifications = checked;
                            return draft;
                        })
                    ));
                }}
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
                defaultChecked={settings.analysis.includedClassifications.brilliant}
                onChange={checked => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.includedClassifications.brilliant = checked;
                            return draft;
                        })
                    ));
                }}
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
                defaultChecked={settings.analysis.includedClassifications.theory}
                onChange={checked => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.includedClassifications.theory = checked;
                            return draft;
                        })
                    ));
                }}
            />
        </div>
    </>;
}

export default ClassificationOptionsArea;