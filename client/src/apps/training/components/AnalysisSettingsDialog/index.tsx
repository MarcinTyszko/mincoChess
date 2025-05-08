import React from "react";
import { useTranslation } from "react-i18next";

import Dialog from "@components/common/Dialog";

import EngineOptionsArea from "./EngineOptionsArea";
import ClassificationOptionsArea from "./ClassificationOptionsArea";
import AnalysisSettingsDialogProps from "./AnalysisSettingsDialogProps";
import * as styles from "./AnalysisSettingsDialog.module.css";

function AnalysisSettingsDialog({ setOpen }: AnalysisSettingsDialogProps) {
    const { t } = useTranslation();

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

        <EngineOptionsArea/>

        <ClassificationOptionsArea/>
    </Dialog>;
}

export default AnalysisSettingsDialog;