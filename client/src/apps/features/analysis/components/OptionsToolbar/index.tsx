import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import Button from "@/components/common/Button";
import SettingsDialog from "../SettingsDialog";
import ShareDialog from "../ShareDialog";

import * as styles from "./OptionsToolbar.module.css";

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
                icon={require("@assets/img/interface/back.svg")}
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
                icon={require("@assets/img/interface/flip.svg")}
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
                icon={require("@assets/img/interface/settings.svg")}
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
                icon={require("@assets/img/interface/share.svg")}
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