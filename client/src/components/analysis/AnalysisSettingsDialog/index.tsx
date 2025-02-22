import React from "react";
import { useTranslation } from "react-i18next";

import useSettings from "@hooks/useSettings";
import Dialog from "@components/common/Dialog";
import DropdownSetting from "@components/common/settings/DropdownSetting";
import NumberSetting from "@components/common/settings/NumberSetting";
import EngineVersion from "@constants/EngineVersion";

import AnalysisSettingsDialogProps from "./AnalysisSettingsDialogProps";
import * as styles from "./AnalysisSettingsDialog.module.css";

function AnalysisSettingsDialog({ setOpen }: AnalysisSettingsDialogProps) {
    const { t } = useTranslation();

    const { settings, setSettings } = useSettings();

    return <Dialog
        className={styles.settingsDialog}
        setOpen={setOpen}
    >
        <div className={styles.settingsTitle}>
            <img
                src={require("@assets/img/processor.svg")}
                height={30}
            />

            <span>
                {t("pages.analysis.analysisSettings.title")}
            </span>
        </div>

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
                    settings.analysis.engine = value as EngineVersion;

                    setSettings(settings);
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
                    settings.analysis.engineDepth = value;

                    setSettings(settings);
                }}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.engineLines")}</span>

            <NumberSetting
                min={1}
                max={5}
                getInitialValue={() => settings.analysis.engineLines}
                onChange={value => {
                    settings.analysis.engineLines = value;

                    setSettings(settings);
                }}
                style={{ width: "180px" }}
            />
        </div>

        <span style={{ color: "white" }}>
            {t("pages.analysis.analysisSettings.includeClassifications")}
        </span>

        {/* <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.brilliant")}</span>

            <input
                className={styles.settingsField}
                type="checkbox"
                checked={analysisSettings.includeBrilliant ?? true}
                onChange={event => {
                    setAnalysisSettings({
                        ...analysisSettings,
                        includeBrilliant: event.target.checked
                    });
                }}
            />
        </div>

        <div className={styles.setting}>
            <span>{t("pages.analysis.analysisSettings.theory")}</span>

            <input
                className={styles.settingsField}
                type="checkbox"
                checked={analysisSettings.includeTheory ?? true}
                onChange={event => {
                    setAnalysisSettings({
                        ...analysisSettings,
                        includeTheory: event.target.checked
                    });
                }}
            />
        </div> */}
    </Dialog>;
}

export default AnalysisSettingsDialog;