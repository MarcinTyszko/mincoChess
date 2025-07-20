import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import Button from "@/components/common/Button";
import SettingsDialog from "../SettingsDialog";
import ShareDialog from "../ShareDialog";

import * as styles from "./OptionsToolbar.module.css";

import iconInterfaceBack from "@assets/img/interface/back.svg";
import iconInterfaceFlip from "@assets/img/interface/flip.svg";
import iconInterfaceSettings from "@assets/img/interface/settings.svg";
import iconInterfaceShare from "@assets/img/interface/share.svg";

function OptionsToolbar() {
    const { t } = useTranslation(["analysis", "common"]);

    const { analysisGame, gameAnalysisOpen } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        boardFlipped,
        setBoardFlipped
    } = useAnalysisBoardStore();

    const [ settingsOpen, setSettingsOpen ] = useState(false);
    const [ shareOpen, setShareOpen ] = useState(false);

    return <>
        <div className={styles.wrapper}>
            {gameAnalysisOpen && <Button
                icon={iconInterfaceBack}
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
                icon={iconInterfaceFlip}
                iconSize={"40px"}
                tooltipId={"options-toolbar-flip"}
                onClick={() => setBoardFlipped(!boardFlipped)}
            />

            <Tooltip
                id="options-toolbar-flip"
                content={t("options.flipBoard")}
                delayShow={500}
            />

            <Button
                className={styles.optionButton}
                icon={iconInterfaceSettings}
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
                icon={iconInterfaceShare}
                iconSize={"35px"}
                tooltipId={"options-toolbar-share"}
                onClick={() => setShareOpen(true)}
            />

            <Tooltip
                id="options-toolbar-share"
                content={t("options.share")}
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