import React from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import useSidebarStore from "@apps/analysis/stores/SidebarStore";
import Breakpoints from "@constants/Breakpoints";
import Button from "@components/common/Button";
import LanguageSwitcher from "@components/settings/LanguageSwitcher";

import * as styles from "./NavigationBar.module.css";

function NavigationBar() {
    const { t } = useTranslation();

    const { sidebarOpen, setSidebarOpen } = useSidebarStore();

    return <div className={styles.navigationBar}>
        <div className={styles.navigationBarSection}>
            {innerWidth <= Breakpoints.RETRACT_SIDEBAR
                && <img
                    className={styles.menuButton}
                    src={require("@assets/img/interface/menu.svg")}
                    height={35}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                />
            }

            <img
                src={require("@assets/img/logo.svg")}
                title="WINTR"
                height={40}
                draggable={false}
            />

            <span className={styles.title}>
                Wintr

                <b style={{ letterSpacing: 0 }}>
                    Chess
                </b>
            </span>
        </div>

        <div className={styles.navigationBarSection}
            style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap"
            }}
        >
            <a href="https://ko-fi.com/wintrcat" target="_blank">
                <Button
                    style={{
                        background: "linear-gradient(-225deg,"
                            + "#22E1FF 0%, #1D8FE1 48%, #625EB1 100%)",
                        fontFamily: "Nunito"
                    }}
                    icon={require("@assets/img/kofi.svg")}
                    tooltipId="navigation-bar-support"
                >
                    {t("navigationBar.support")}
                </Button>
            </a>

            <Tooltip
                id="navigation-bar-support"
                content={t("navigationBar.tooltips.support")}
                delayShow={500}
            />

            <LanguageSwitcher/>

            <a href="/help">
                <Button
                    icon={require("@assets/img/interface/help.svg")}
                    style={{
                        width: "52px",
                        padding: "5px"
                    }}
                    iconSize="32px"
                    tooltipId={"navigation-bar-help-center"}
                />
            </a>

            <Tooltip
                id="navigation-bar-help-center"
                content={t("navigationBar.tooltips.help")}
                delayShow={500}
            />
        </div>
    </div>;
}

export default NavigationBar;