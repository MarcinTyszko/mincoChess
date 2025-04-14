import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Button from "@components/common/Button";
import GameSelector from "@apps/training/components/GameSelector";

import Header from "./Header";
import * as styles from "./HelpCenter.module.css";

function HelpCenter() {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <Header
            image={require("@assets/img/help.svg")}
            size="1.7rem"
        >
            {t("pages.helpCenter.title")}
        </Header>

        <div className={styles.section}>
            <Header
                image={require("@assets/img/helpCenter/mail.png")}
                size="1.3rem"
            >
                {t("pages.helpCenter.contact.title")}
            </Header>

            <span>
                {t("pages.helpCenter.contact.message")}
            </span>

            <a
                className={styles.importantValue}
                href="mailto:contact@wintrchess.com"
            >
                <b>contact@wintrchess.com</b>
            </a>
        </div>

        <div className={styles.section}>
            <Header
                image={require("@assets/img/helpCenter/analysis.png")}
                size="1.3rem"
            >
                {t("pages.helpCenter.analysis.title")}
            </Header>

            <div>
                <span>
                    {t("pages.helpCenter.analysis.part1")}&ensp;

                    <Link to="/">
                        {t("pages.helpCenter.analysis.part2")}
                    </Link>
                </span>

                <span>
                    {t("pages.helpCenter.analysis.part3")}
                </span>
            </div>

            <GameSelector style={{ width: "min(320px, 100%)" }}/>

            <span>
                {t("pages.helpCenter.analysis.part4")}
            </span>

            <span>
                {t("pages.helpCenter.analysis.part5")}
            </span>

            <Button
                icon={require("@assets/img/analysis.svg")}
                iconSize="30px"
                style={{
                    width: "min(320px, 100%)",
                    fontSize: "1.1rem"
                }}
            >
                {t("pages.analysis.analyseButton")}
            </Button>
        </div>
    </div>;
}

export default HelpCenter;