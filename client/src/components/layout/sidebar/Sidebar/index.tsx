import React from "react";
import { useTranslation } from "react-i18next";

import SidebarTab from "../SidebarTab";
import Separator from "@/components/common/Separator";
import Typography from "@/components/Typography";

import SidebarProps from "./SidebarProps";
import * as styles from "./Sidebar.module.css";

function Sidebar({ style, onClose }: SidebarProps) {
    const { t } = useTranslation("common");

    return <div
        className={styles.sidebar}
        style={style}
        onClick={event => event.stopPropagation()}
    >
        <div className={styles.titleSection}>
            <img
                className={styles.closeButton}
                src={require("@assets/img/interface/close.svg")}
                onClick={onClose}
            />

            <Typography className={styles.title} includeIcon/>
        </div>

        <div style={{ padding: "0 10px" }}>
            <Separator style={{ margin: 0 }} />
        </div>

        <div className={styles.tabs}>
            <div className={styles.tabSection}>
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

                <SidebarTab
                    url="/news"
                    icon={require("@assets/img/icons/news.png")}
                    style={{ width: "100%" }}
                >
                    {t("sidebar.news")}
                </SidebarTab>
            </div>

            <div className={styles.tabSection}>
                <SidebarTab
                    url="/settings"
                    icon={require("@assets/img/icons/settings.png")}
                    style={{ width: "100%" }}
                >
                    {t("settings")}
                </SidebarTab>
            </div>
        </div>
    </div>;
}

export default Sidebar;