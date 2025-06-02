import React from "react";
import { useTranslation } from "react-i18next";

import Dialog from "@components/common/Dialog";

import EngineOptionsArea from "./EngineOptionsArea";
import ClassificationOptionsArea from "./ClassificationOptionsArea";
import OtherOptionsArea from "./OtherOptionsArea";

import SettingsDialogProps from "./SettingsDialogProps";
import * as styles from "./SettingsDialog.module.css";

function SettingsDialog({ onClose }: SettingsDialogProps) {
    const { t } = useTranslation();

    return <Dialog
        className={styles.settingsDialog}
        onClose={onClose}
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

        <EngineOptionsArea/>

        <ClassificationOptionsArea/>

        <OtherOptionsArea/>
    </Dialog>;
}

export default SettingsDialog;