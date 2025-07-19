import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/common/Button";

import AnalyseButtonProps from "./AnalyseButtonProps";
import * as styles from "./AnalyseButton.module.css";

function AnalyseButton({ style, onClick }: AnalyseButtonProps) {
    const { t } = useTranslation("analysis");

    return <Button
        className={styles.analyseButton}
        style={style}
        icon={require("@assets/img/analysis.svg")}
        iconSize="30px"
        onClick={onClick}
    >
        {t("analyseButton")}
    </Button>;
}

export default AnalyseButton;