import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import useSidebarStore from "@apps/training/stores/SidebarStore";
import SidebarTab from "../SidebarTab";
import useDelayedEffect from "@hooks/useDelayedEffect";

import SidebarProps from "./SidebarProps";
import * as styles from "./Sidebar.module.css";

function Sidebar({ style }: SidebarProps) {
    const { t } = useTranslation();

    const { sidebarOpen } = useSidebarStore();

    const sidebarRef = useRef<HTMLDivElement>(null);

    useDelayedEffect(() => {
        if (!sidebarRef.current) return;

        sidebarRef.current.className = styles.sidebar;

        // Reset animation by forcing rerender of sidebar
        void sidebarRef.current.offsetWidth;

        sidebarRef.current.classList.add(
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        );  
    }, [sidebarOpen]);

    return <div
        className={(
            `${styles.sidebar} `
            + (
                sidebarOpen
                    ? styles.sidebarOpenStatic
                    : styles.sidebarClosedStatic
            )
        )}
        style={style}
        ref={sidebarRef}
    >
        <div className={styles.tabs}>
            <SidebarTab
                navigateTo="/" 
                icon={require("@assets/img/analysis.svg")}
                style={{ width: "100%" }}
            >
                {t("sidebar.analysis")}
            </SidebarTab>

            <SidebarTab
                navigateTo="/archive" 
                icon={require("@assets/img/archive.svg")} 
                iconSize="20px"
                style={{ width: "100%" }}
            >
                {t("sidebar.archive")}
            </SidebarTab>
        </div>

        <div className={styles.footer}>
            <SidebarTab
                navigateTo="/news"
                icon={require("@assets/img/news-icon.svg")}
                style={{ width: "100%" }}
            >
                {t("sidebar.news")}
            </SidebarTab>

            <SidebarTab
                navigateTo="/settings"
                icon={require("@assets/img/settings.svg")}
                style={{ width: "100%" }}
            >
                {t("settings")}
            </SidebarTab>

            <div className={styles.footerLinks}>
                <Link
                    to="/privacy"
                    style={{
                        color: "white",
                        margin: "10px 0",
                        fontSize: "0.85rem"
                    }}
                >
                    {t("sidebar.privacyPolicy")}
                </Link>

                <Link
                    to="/credits"
                    style={{
                        color: "white",
                        margin: "10px 0",
                        fontSize: "0.85rem"
                    }}
                >
                    {t("sidebar.credits")}
                </Link>
            </div>
        </div>
    </div>;
}

export default Sidebar;