import React from "react";
import { useTranslation } from "react-i18next";

import useSettingsStore from "@stores/SettingsStore";
import CheckboxSetting from "@components/settings/CheckboxSetting";

import * as categoryStyles from "../Category.module.css";

function BugReporting() {
    const { t } = useTranslation();

    const { settings, setSettings } = useSettingsStore();

    return <div className={categoryStyles.wrapper}>
        <b className={categoryStyles.header}>
            {t("pages.settings.categories.bugReporting.bugReportingMode")}
        </b>

        <span style={{ color: "gray" }}>
            {t("pages.settings.categories.bugReporting.bugReportingModeDescription")}
        </span>

        <div className={categoryStyles.setting}>
            <span>
                {t("pages.settings.categories.bugReporting.bugReportingMode")}
            </span>

            <CheckboxSetting
                defaultChecked={settings.bugReportingMode}
                onChange={checked => (
                    setSettings(draft => {
                        draft.bugReportingMode = checked;
                        return draft;
                    })
                )}
            />
        </div>
    </div>;
}

export default BugReporting;