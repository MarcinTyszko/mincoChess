import React from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { produce } from "immer";

import useSettingsStore from "@stores/SettingsStore";
import CheckboxSetting from "@components/settings/CheckboxSetting";

import * as styles from "../AnalysisSettingsDialog.module.css";

function OtherOptionsArea() {
    const { t } = useTranslation();

    const { settings, setSettings } = useSettingsStore();

    return <>
        <span className={styles.header}>
            {t("pages.analysis.settings.other.title")}
        </span>

        <div className={styles.setting}>
            <span data-tooltip-id="settings-other-simple-notation">
                {t("pages.analysis.settings.other.simpleNotation")}
            </span>

            <Tooltip
                id="settings-other-simple-notation"
                delayShow={500}
                className={styles.settingDescription}
            >
                {t("pages.analysis.settings.other.descriptions.simpleNotation")}
            </Tooltip>

            <CheckboxSetting
                defaultChecked={settings.analysis.simpleNotation}
                onChange={checked => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.simpleNotation = checked;
                            return draft;
                        })
                    ));
                }}
            />
        </div>
    </>;
}

export default OtherOptionsArea;