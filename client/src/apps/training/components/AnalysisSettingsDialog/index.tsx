import React from "react";
import { useTranslation } from "react-i18next";
import { produce } from "immer";
import { clamp, floor } from "lodash";

import { EngineVersion } from "wintrchess";
import useSettingsStore from "@stores/SettingsStore";
import Dialog from "@components/common/Dialog";
import DropdownSetting from "@components/settings/DropdownSetting";
import NumberSetting from "@components/settings/NumberSetting";
import CheckboxSetting from "@components/settings/CheckboxSetting";

import AnalysisSettingsDialogProps from "./AnalysisSettingsDialogProps";
import * as styles from "./AnalysisSettingsDialog.module.css";

const engineOptions = [
    {
        label: "Stockfish 17 (68 MB)",
        value: EngineVersion.STOCKFISH_17
    },
    {
        label: "Stockfish 17 Lite (Recommended)",
        value: EngineVersion.STOCKFISH_17_LITE
    },
    {
        label: "Stockfish 17 (Compatibility)",
        value: EngineVersion.STOCKFISH_17_ASM
    }
];

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

        <span className={styles.header}>
            {t("pages.analysis.settings.engine.title")}
        </span>

        <span className={styles.setting}>
            <span>{t("enabled")}</span>

            <CheckboxSetting
                defaultChecked={settings.analysis.engineEnabled}
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
            <span>{t("pages.analysis.settings.engine.version")}</span>

            <DropdownSetting
                options={engineOptions}
                defaultValue={engineOptions.find(
                    option => option.value == settings.analysis.engine
                )}
                onSelect={option => {
                    if (!option) return;

                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engine = option.value;
                            return draft;
                        })
                    ));
                }}
                dropdownStyle={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engine.depth")}</span>

            <NumberSetting
                min={10}
                max={99}
                defaultValue={settings.analysis.engineDepth}
                onChange={value => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engineDepth = floor(
                                clamp(value, 10, 99)
                            );
                            return draft;
                        })
                    ));
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engine.lines")}</span>

            <NumberSetting
                min={0}
                max={5}
                defaultValue={settings.analysis.engineLines}
                onChange={value => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engineLines = floor(
                                clamp(value, 1, 5)
                            );
                            return draft;
                        })
                    ));
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engine.timeLimit")}</span>

            <div className={styles.subsetting}>
                <CheckboxSetting
                    defaultChecked={settings.analysis.engineLimitTime}
                    onChange={checked => {
                        setSettings(settings => (
                            produce(settings, draft => {
                                draft.analysis.engineLimitTime = checked;
                                return draft;
                            })
                        ));
                    }}
                />

                <NumberSetting
                    min={0.01}
                    defaultValue={settings.analysis.engineMoveTime}
                    onChange={value => {
                        setSettings(settings => (
                            produce(settings, draft => {
                                draft.analysis.engineMoveTime = floor(
                                    Math.max(0.01, value), 2
                                );
                                return draft;
                            })
                        ));
                    }}
                    style={{ width: "180px" }}
                />
            </div>
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engine.threadCount")}</span>

            <NumberSetting
                min={1}
                max={64}
                defaultValue={settings.analysis.engineThreadCount}
                onChange={value => {
                    setSettings(settings => (
                        produce(settings, draft => {
                            draft.analysis.engineThreadCount = floor(
                                clamp(value, 1, 64)
                            );
                            return draft;
                        })
                    ));
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.settings.engine.suggestionArrows")}</span>

            <CheckboxSetting
                defaultChecked={settings.analysis.suggestionArrows}
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
    </Dialog>;
}

export default AnalysisSettingsDialog;