import React from "react";
import { useTranslation } from "react-i18next";
import { clamp } from "lodash";

import { EngineVersion } from "wintrchess";
import useSettingsStore from "@stores/SettingsStore";
import Dialog from "@components/common/Dialog";
import DropdownSetting from "@components/common/settings/DropdownSetting";
import NumberSetting from "@components/common/settings/NumberSetting";
import CheckboxSetting from "@components/common/settings/CheckboxSetting";

import AnalysisSettingsDialogProps from "./AnalysisSettingsDialogProps";
import * as styles from "./AnalysisSettingsDialog.module.css";

function AnalysisSettingsDialog({ setOpen }: AnalysisSettingsDialogProps) {
    const { t } = useTranslation();

    const { settings, setSettings } = useSettingsStore();

    return <Dialog
        className={styles.settingsDialog}
        setOpen={setOpen}
    >
        <div className={styles.settingsTitle}>
            <img
                src={require("@assets/img/engine.png")}
                height={30}
            />

            <span style={{ fontFamily: "Nunito" }}>
                {t("pages.analysis.analysisSettings.title")}
            </span>
        </div>

        <span className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.engineEnabled")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.engineEnabled}
                onChange={checked => {
                    setSettings(settings => {
                        settings.analysis.engineEnabled = checked;
                        return settings;
                    });
                }}
            />
        </span>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.engine")}</span>

            <DropdownSetting
                options={[
                    {
                        label: "Stockfish 16",
                        value: EngineVersion.STOCKFISH_16_1
                    },
                    {
                        label: "Stockfish 16 Lite",
                        value: EngineVersion.STOCKFISH_16_1_LITE
                    }
                ]}
                getInitialValue={() => settings.analysis.engine}
                onSelect={value => {
                    setSettings(settings => {
                        settings.analysis.engine = value as EngineVersion;
                        return settings;
                    });
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.engineDepth")}</span>

            <NumberSetting
                min={10}
                max={99}
                getInitialValue={() => settings.analysis.engineDepth}
                onChange={value => {
                    setSettings(settings => {
                        settings.analysis.engineDepth = clamp(value, 10, 99);
                        return settings;
                    });
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.engineLines")}</span>

            <NumberSetting
                min={0}
                max={5}
                getInitialValue={() => settings.analysis.engineLines}
                onChange={value => {
                    setSettings(settings => {
                        settings.analysis.engineLines = clamp(value, 0, 5);
                        return settings;
                    });
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.hideClassifications")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.hideClassifications}
                onChange={checked => {
                    setSettings(settings => {
                        settings.analysis.hideClassifications = checked;
                        return settings;
                    });
                }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.suggestionArrows")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.suggestionArrows}
                onChange={checked => {
                    setSettings(settings => {
                        settings.analysis.suggestionArrows = checked;
                        return settings;
                    });
                }}
            />
        </div>

        {/* <span style={{ color: "white" }}>
            {t("pages.analysis.analysisSettings.includeClassifications")}
        </span>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.brilliant")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.includedClassifications.brilliant}
                onChange={checked => {
                    setSettings(settings => {
                        settings.analysis.includedClassifications.brilliant = checked;

                        return settings;
                    });
                }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.theory")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.includedClassifications.theory}
                onChange={checked => {
                    setSettings(settings => {
                        settings.analysis.includedClassifications.theory = checked;

                        return settings;
                    });
                }}
            />
        </div> */}
    </Dialog>;
}

export default AnalysisSettingsDialog;