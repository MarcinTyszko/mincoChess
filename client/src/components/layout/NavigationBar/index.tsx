import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import Typography from "@components/Typography";
import Button from "@components/common/Button";
import LanguageSwitcher from "@components/settings/LanguageSwitcher";
import BlurBackground from "@components/layout/BlurBackground";
import Sidebar from "@components/layout/sidebar/Sidebar";

import HoverDropdown from "./HoverDropdown";
import * as styles from "./NavigationBar.module.css";

function NavigationBar() {
    const { t } = useTranslation();

    const [ sidebarOpen, setSidebarOpen ] = useState(false);

    return <div className={styles.wrapper}>
        <div className={styles.section}>
            <div className={styles.section}>
                <img
                    className={styles.menuButton}
                    src={require("@assets/img/interface/menu.svg")}
                    height={35}
                    onClick={() => setSidebarOpen(true)}
                />

                <Typography
                    textClassName={styles.typographyText}
                    includeIcon
                />
            </div>

            <div className={styles.tabs}>
                <HoverDropdown
                    icon={require("@assets/img/icons/analysis.png")}
                    url="/analysis"
                >
                    {t("sidebar.analysis")}
                </HoverDropdown>

                <HoverDropdown
                    icon={require("@assets/img/icons/archive.png")}
                    url="/archive"
                >
                    {t("sidebar.archive")}
                </HoverDropdown>

                <HoverDropdown
                    icon={require("@assets/img/icons/news.png")}
                    url="/news"
                >
                    {t("sidebar.news")}
                </HoverDropdown>
            </div>
        </div>

        <div className={styles.section}>
            <LanguageSwitcher/>

            <a href="https://ko-fi.com/wintrcat" target="_blank">
                <Button
                    className={styles.support}
                    icon={require("@assets/img/kofi.svg")}
                    tooltipId="navigation-bar-support"
                />
            </a>

            <Tooltip
                id="navigation-bar-support"
                content={t("navigationBar.tooltips.support")}
                delayShow={500}
            />

            {/* <Button
                className={styles.signIn}
                icon={require("@assets/img/interface/signin.svg")}
                iconSize="28px"
            >
                {t("navigationBar.signIn")}
            </Button> */}

            <a href="/settings">
                <Button
                    className={styles.settings}
                    icon={require("@assets/img/icons/settings.png")}
                    iconSize="28px"
                    tooltipId="navigation-bar-settings"
                />
            </a>

            <Tooltip
                id="navigation-bar-settings"
                content={t("settings")}
                delayShow={500}
            />
        </div>

        {sidebarOpen && <BlurBackground
            style={{ zIndex: 1000 }}
            onClick={() => setSidebarOpen(false)}
        />}

        <Sidebar
            style={{
                zIndex: 1001,
                transition: "left 0.3s ease",
                left: sidebarOpen ? "0" : "-320px"
            }}
            onClose={() => setSidebarOpen(false)}
        />
    </div>;
}

export default NavigationBar;