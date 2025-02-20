import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useSettings from "@hooks/useSettings";
import EngineVersion from "@constants/EngineVersion";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import Button from "@components/common/Button";
import Dialog from "@components/common/Dialog";
import DropdownSetting from "@components/common/settings/DropdownSetting";
import NumberSetting from "@components/common/settings/NumberSetting";

import * as styles from "./OptionsToolbar.module.css";

function OptionsToolbar() {
    const { t } = useTranslation();

    const { gameAnalysisOpen } = useAnalysisGameStore();

    const {
        boardFlipped,
        setBoardFlipped
    } = useAnalysisBoardStore();

    const { settings, setSettings } = useSettings();

    const [ settingsOpen, setSettingsOpen ] = useState(false);

    return <>
        <div className={styles.wrapper}>
            {
                gameAnalysisOpen
                && <Button
                    icon={require("@assets/img/back.svg")}
                    iconSize={"40px"}
                    className={styles.backButton}
                    tooltip={t("back")}
                    onClick={() => location.reload()}
                />
            }

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/flip.svg")}
                iconSize={"40px"}
                tooltip={t("pages.analysis.options.flipBoard")}
                onClick={() => setBoardFlipped(!boardFlipped)}
            />

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/settings.svg")}
                iconSize={"35px"}
                tooltip={t("settings")}
                onClick={() => setSettingsOpen(true)}
            />

            <Button
                className={styles.optionButton}
                icon={require("@assets/img/share.svg")}
                iconSize={"35px"}
                tooltip={t("pages.analysis.options.share")}
                onClick={() => console.log("share! kawaii!!")}
            />
        </div>

        {
            settingsOpen
            && <Dialog
                className={styles.settingsDialog}
                setOpen={setSettingsOpen}
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
            </Dialog>
        }
    </>;
}

export default OptionsToolbar;