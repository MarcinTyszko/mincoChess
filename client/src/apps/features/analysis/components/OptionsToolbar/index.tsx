import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { StatusCodes } from "http-status-codes";
import { FetchStatus } from "@tanstack/react-query";

import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAccountProfile from "@/hooks/api/useAccountProfile";
import Button from "@/components/common/Button";
import SettingsDialog from "../SettingsDialog";
import ShareDialog from "../ShareDialog";
import displayToast from "@/lib/toast";
import { archiveGame } from "@/lib/api/gameArchive";

import * as styles from "./OptionsToolbar.module.css";

import iconBack from "@assets/img/interface/back.svg";
import iconFlip from "@assets/img/interface/flip.svg";
import iconSettings from "@assets/img/interface/settings.svg";
import iconShare from "@assets/img/interface/share.svg";
import iconSave from "@assets/img/interface/save.svg";

function OptionsToolbar() {
    const { t } = useTranslation(["analysis", "common"]);

    const [ searchParams, setSearchParams ] = useSearchParams();

    const { status: profileStatus } = useAccountProfile();

    const { analysisGame, gameAnalysisOpen } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        boardFlipped,
        setBoardFlipped
    } = useAnalysisBoardStore();

    const [ settingsOpen, setSettingsOpen ] = useState(false);
    const [ shareOpen, setShareOpen ] = useState(false);

    const [ archiveStatus, setArchiveStatus ] = useState<FetchStatus>("idle");

    async function saveToArchive() {
        setArchiveStatus("fetching");

        const archival = await archiveGame(
            analysisGame,
            searchParams.get("game") || undefined
        );

        if (archival.status == StatusCodes.INSUFFICIENT_STORAGE)
            return displayToast({
                message: t("optionsToolbar.noArchiveStorage"),
                theme: "error",
                autoClose: false
            });

        if (!archival.id) return displayToast({
            message: t("unknownError", { ns: "common" }),
            theme: "error"
        });

        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            game: archival.id
        });

        setArchiveStatus("idle");

        displayToast({
            message: t("optionsToolbar.gameArchived"),
            theme: "success",
            autoClose: 10
        });
    }

    return <>
        <div className={styles.wrapper}>
            {gameAnalysisOpen && <Button
                icon={iconBack}
                iconSize={"40px"}
                className={styles.backButton}
                tooltipId={"options-toolbar-back"}
                onClick={() => location.reload()}
            />}

            <Tooltip
                id="options-toolbar-back"
                content={t("back", { ns: "common" })}
                delayShow={500}
            />

            <Button
                className={styles.optionButton}
                icon={iconFlip}
                iconSize={"40px"}
                tooltipId={"options-toolbar-flip"}
                onClick={() => setBoardFlipped(!boardFlipped)}
            />

            <Tooltip
                id="options-toolbar-flip"
                content={t("optionsToolbar.flipBoard")}
                delayShow={500}
            />

            <Button
                className={styles.optionButton}
                icon={iconSettings}
                iconSize={"35px"}
                tooltipId={"options-toolbar-settings"}
                onClick={() => setSettingsOpen(true)}
            />

            <Tooltip
                id="options-toolbar-settings"
                content={t("settings", { ns: "common" })}
                delayShow={500}
            />

            <Button
                className={styles.optionButton}
                icon={iconShare}
                iconSize={"35px"}
                tooltipId={"options-toolbar-share"}
                onClick={() => setShareOpen(true)}
            />

            <Tooltip
                id="options-toolbar-share"
                content={t("options.share")}
                delayShow={500}
            />

            {(gameAnalysisOpen && profileStatus == "success") && <Button
                className={styles.optionButton}
                icon={iconSave}
                iconSize={"35px"}
                tooltipId={"options-toolbar-save"}
                disabled={archiveStatus == "fetching"}
                onClick={saveToArchive}
            />}

            <Tooltip
                id="options-toolbar-save"
                content={t("optionsToolbar.save")}
                delayShow={500}
            />
        </div>

        {settingsOpen && <SettingsDialog
            onClose={() => setSettingsOpen(false)}
        />}

        {shareOpen && <ShareDialog
            game={analysisGame}
            currentNode={currentStateTreeNode}
            onClose={() => setShareOpen(false)}
        />}
    </>;
}

export default OptionsToolbar;