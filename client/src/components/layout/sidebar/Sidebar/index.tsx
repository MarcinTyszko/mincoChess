import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import useSidebarStore from "@apps/analysis/stores/SidebarStore";
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
            + (sidebarOpen
                ? styles.sidebarOpenStatic
                : styles.sidebarClosedStatic
            )
        )}
        style={style}
        ref={sidebarRef}
    >
        <div className={styles.tabs}>
            <SidebarTab
                url="/analysis" 
                icon={require("@assets/img/icons/analysis.png")}
                style={{ width: "100%" }}
            >
                {t("sidebar.analysis")}
            </SidebarTab>

            <SidebarTab
                url="/archive" 
                icon={require("@assets/img/icons/archive.png")} 
                iconSize="20px"
                style={{ width: "100%" }}
            >
                {t("sidebar.archive")}
            </SidebarTab>
        </div>

        <div className={styles.footer}>
            <SidebarTab
                url="/news"
                icon={require("@assets/img/icons/news.png")}
                style={{ width: "100%" }}
            >
                {t("sidebar.news")}
            </SidebarTab>

            <SidebarTab
                url="/settings"
                icon={require("@assets/img/icons/settings.png")}
                style={{ width: "100%" }}
            >
                {t("settings")}
            </SidebarTab>

            <div className={styles.footerLinks}>
                <a href="/privacy" className={styles.footerLink}>
                    {t("sidebar.privacyPolicy")}
                </a>

                <a href="/credits" className={styles.footerLink}>
                    {t("sidebar.credits")}
                </a>
            </div>
        </div>
    </div>;
}

export default Sidebar;