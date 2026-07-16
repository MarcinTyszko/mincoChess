import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useLinkedAccountsStore from "@/stores/LinkedAccountsStore";
import useSettingsStore from "@/stores/SettingsStore";
import Button from "@/components/common/Button";
import SwitchSetting from "@/components/settings/SwitchSetting";
import displayToast from "@/lib/toast";

import * as styles from "./LinkedAccountsSettings.module.css";

/**
 * @description Account settings section for external Chess accounts:
 * linked chess.com / lichess usernames plus the recent games panel toggle.
 */
function LinkedAccountsSettings() {
    const { t } = useTranslation("settings");

    const {
        chessCom,
        lichess,
        setLinkedAccounts,
        syncWithServer
    } = useLinkedAccountsStore();

    const { settings, setSettings } = useSettingsStore();

    const [ chessComInput, setChessComInput ] = useState(chessCom || "");
    const [ lichessInput, setLichessInput ] = useState(lichess || "");

    useEffect(() => {
        syncWithServer();
    }, []);

    useEffect(() => {
        setChessComInput(chessCom || "");
        setLichessInput(lichess || "");
    }, [chessCom, lichess]);

    function save() {
        setLinkedAccounts({
            chessCom: chessComInput.trim() || undefined,
            lichess: lichessInput.trim() || undefined
        });

        displayToast({
            message: t("account.linkedAccounts.savedToast"),
            theme: "success",
            autoClose: 3
        });
    }

    return <div className={styles.wrapper}>
        <label className={styles.field}>
            <span className={styles.fieldLabel}>Chess.com</span>

            <input
                className={styles.fieldInput}
                value={chessComInput}
                placeholder={t("account.linkedAccounts.usernamePlaceholder")}
                onChange={event => setChessComInput(event.target.value)}
            />
        </label>

        <label className={styles.field}>
            <span className={styles.fieldLabel}>Lichess</span>

            <input
                className={styles.fieldInput}
                value={lichessInput}
                placeholder={t("account.linkedAccounts.usernamePlaceholder")}
                onChange={event => setLichessInput(event.target.value)}
            />
        </label>

        <Button onClick={save} style={{ alignSelf: "flex-start" }}>
            {t("account.linkedAccounts.saveButton")}
        </Button>

        <div className={styles.toggleRow}>
            <span>{t("account.linkedAccounts.recentGamesToggle")}</span>

            <SwitchSetting
                defaultChecked={settings.analysis.recentGamesEnabled}
                onChange={checked => setSettings(draft => {
                    draft.analysis.recentGamesEnabled = checked;
                    return draft;
                })}
            />
        </div>

        <div className={styles.toggleRow}>
            <span>{t("account.linkedAccounts.autoAnalyseToggle")}</span>

            <SwitchSetting
                defaultChecked={settings.analysis.autoAnalyseRecentGames}
                onChange={checked => setSettings(draft => {
                    draft.analysis.autoAnalyseRecentGames = checked;
                    return draft;
                })}
            />
        </div>

        {settings.analysis.autoAnalyseRecentGames && <>
            <div className={styles.toggleRow}>
                <span>
                    {t("account.linkedAccounts.autoAnalyseAllToggle")}
                </span>

                <SwitchSetting
                    defaultChecked={settings.analysis.autoAnalyseAllGames}
                    onChange={checked => setSettings(draft => {
                        draft.analysis.autoAnalyseAllGames = checked;
                        return draft;
                    })}
                />
            </div>

            {!settings.analysis.autoAnalyseAllGames
                && <div className={styles.sliderRow}>
                    <span>
                        {t("account.linkedAccounts.autoAnalyseCountLabel")}
                    </span>

                    <input
                        className={styles.slider}
                        type="range"
                        min={1}
                        max={50}
                        value={settings.analysis.autoAnalyseGamesCount}
                        onChange={event => {
                            const count = parseInt(event.target.value);

                            setSettings(draft => {
                                draft.analysis.autoAnalyseGamesCount = count;
                                return draft;
                            });
                        }}
                    />

                    <span className={styles.sliderValue}>
                        {settings.analysis.autoAnalyseGamesCount}
                    </span>
                </div>
            }
        </>}

        <span className={styles.hint}>
            {t("account.linkedAccounts.autoAnalyseHint")}
        </span>
    </div>;
}

export default LinkedAccountsSettings;
