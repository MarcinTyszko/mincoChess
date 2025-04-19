import React from "react";
import { useTranslation } from "react-i18next";
import { produce } from "immer";
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
        <div className={`${styles.header} ${styles.title}`}>
            <img
                src={require("@assets/img/icons/engine.png")}
                height={30}
            />

            <span style={{ fontFamily: "Nunito" }}>
                {t("pages.analysis.settings.title")}
            </span>
        </div>

        <span className={styles.setting}>
            <span>{t("pages.analysis.settings.engineEnabled")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.engineEnabled}
                onChange={checked => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engineEnabled = checked;
                            return draft;
                        })
                    ));
                }}
            />
        </span>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engine")}</span>

            <DropdownSetting
                options={[
                    {
                        label: "Stockfish 17",
                        value: EngineVersion.STOCKFISH_17
                    },
                    {
                        label: "Stockfish 17 Lite",
                        value: EngineVersion.STOCKFISH_17_LITE
                    }
                ]}
                getInitialValue={() => settings.analysis.engine}
                onSelect={value => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engine = value as EngineVersion;
                            return draft;
                        })
                    ));
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engineDepth")}</span>

            <NumberSetting
                min={10}
                max={99}
                getInitialValue={() => settings.analysis.engineDepth}
                onChange={value => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engineDepth = clamp(value, 10, 99);
                            return draft;
                        })
                    ));
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engineLines")}</span>

            <NumberSetting
                min={0}
                max={5}
                getInitialValue={() => settings.analysis.engineLines}
                onChange={value => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engineLines = clamp(value, 1, 5);
                            return draft;
                        })
                    ));
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.hideClassifications")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.hideClassifications}
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
            <span>{t("pages.analysis.settings.suggestionArrows")}</span>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.suggestionArrows}
                onChange={checked => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.suggestionArrows = checked;
                            return draft;
                        })
                    ));
                }}
            />
        </div>

        <span className={styles.header}>
            {t("pages.analysis.settings.includeClassifications")}
        </span>

        <div className={styles.setting}>
            <div className={styles.settingName}>
                <img
                    className={styles.settingIcon}
                    src={require("@assets/img/classifications/brilliant.png")}
                />

                <span>{t("pages.analysis.settings.brilliant")}</span>
            </div>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.includedClassifications.brilliant}
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
            <div className={styles.settingName}>
                <img
                    className={styles.settingIcon}
                    src={require("@assets/img/classifications/theory.png")}
                />

                <span>{t("pages.analysis.settings.theory")}</span>
            </div>

            <CheckboxSetting
                getInitialValue={() => settings.analysis.includedClassifications.theory}
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
    </Dialog>;
}

export default AnalysisSettingsDialog;