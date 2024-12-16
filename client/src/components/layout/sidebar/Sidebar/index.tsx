import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import useSidebarStore from "@stores/SidebarStore";
import SidebarTab from "../SidebarTab";

import SidebarProps from "./SidebarProps";
import * as styles from "./Sidebar.module.css";

function Sidebar({ style }: SidebarProps) {
    const { t } = useTranslation();

    const { sidebarOpen } = useSidebarStore();

    const sidebarRef = useRef<HTMLDivElement>(null);
    const initiallyRendered = useRef<boolean>(false);

    useEffect(() => {
        if (!sidebarRef.current) return;
        const sidebar = sidebarRef.current;

        if (!initiallyRendered.current) {
            initiallyRendered.current = true;
            return;
        }

        sidebar.style.animationDuration = "0.5s";

        sidebar.classList.remove(styles.sidebarClosed);
        sidebar.classList.remove(styles.sidebarOpen);

        void sidebar.offsetWidth;

        sidebar.classList.add(
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        );
    }, [sidebarOpen]);

    return <div 
        className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
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
                {t("sidebar.settings")}
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