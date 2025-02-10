import React from "react";
import { useTranslation } from "react-i18next";

import useAnalysisGameStore from "@stores/AnalysisGameStore";
import Button from "@components/common/Button";

import * as styles from "./OptionsToolbar.module.css";

function OptionsToolbar() {
    const { t } = useTranslation();

    const {
        gameAnalysisOpen,
        setGameAnalysisOpen
    } = useAnalysisGameStore();

    return <div className={styles.wrapper}>
        {
            (gameAnalysisOpen || true)
            && <Button
                icon={require("@assets/img/back.svg")}
                iconSize={"40px"}
                style={{
                    padding: "3px",
                    boxSizing: "border-box",
                    width: "52px",
                    backgroundColor: "#383838"
                }}
                tooltip={t("back")}
                onClick={() => setGameAnalysisOpen(false)}
            />
        }

        <div className={styles.buttons}>
            <Button
                icon={require("@assets/img/flip.svg")}
                iconSize={"40px"}
                style={{
                    padding: "6px",
                    backgroundColor: "#323232"
                }}
                tooltip={t("pages.analysis.options.flipBoard")}
                onClick={() => console.log("board flip! kawaii!!")}
            />

            <Button
                icon={require("@assets/img/settings.svg")}
                iconSize={"40px"}
                style={{
                    padding: "6px",
                    backgroundColor: "#323232"
                }}
                tooltip={t("settings")}
                onClick={() => console.log("settings! kawaii!!")}
            />

            <Button
                icon={require("@assets/img/share.svg")}
                iconSize={"40px"}
                style={{
                    padding: "6px",
                    backgroundColor: "#323232"
                }}
                tooltip={t("pages.analysis.options.share")}
                onClick={() => console.log("share! kawaii!!")}
            />
        </div>
    </div>;
}

export default OptionsToolbar;