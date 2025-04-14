import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import useSidebarStore from "@apps/training/stores/SidebarStore";
import Breakpoints from "@constants/Breakpoints";
import Button from "@components/common/Button";
import LanguageSwitcher from "@components/common/LanguageSwitcher";

import * as styles from "./NavigationBar.module.css";

function NavigationBar() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { sidebarOpen, setSidebarOpen } = useSidebarStore();

    return <div className={styles.navigationBar}>
        <div className={styles.navigationBarSection}>
            {
                innerWidth <= Breakpoints.RETRACT_SIDEBAR
                && <img
                    className={styles.menuButton}
                    src={require("@assets/img/menu.svg")}
                    height={35}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                />
            }

            <img
                src={require("@assets/img/logo.svg")}
                alt="WintrChess"
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

        <div className={styles.navigationBarSection}>
            <a 
                href="https://ko-fi.com/wintrcat"
                target="_blank" 
                title={t("navigationBar.tooltips.support")}
            >
                <Button
                    style={{
                        background: "linear-gradient(-225deg,"
                            + "#22E1FF 0%, #1D8FE1 48%, #625EB1 100%)",
                        fontFamily: "Nunito"
                    }}
                    icon={require("@assets/img/kofi.svg")}
                >
                    {t("navigationBar.support")}
                </Button>
            </a>

            <LanguageSwitcher/>

            <Button
                icon={require("@assets/img/help.svg")}
                style={{
                    width: "52px",
                    padding: "5px"
                }}
                iconSize="32px"
                tooltip={t("navigationBar.tooltips.help")}
                onClick={() => navigate("/help")}
            />
        </div>
    </div>;
}

export default NavigationBar;