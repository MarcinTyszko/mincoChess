import React from "react";
import { useTranslation } from "react-i18next";

import { useAuthedProfile } from "@/hooks/api/useProfile";
import SidebarTab from "../SidebarTab";
import Separator from "@/components/common/Separator";
import Typography from "@/components/Typography";

import SidebarProps from "./SidebarProps";
import * as styles from "./Sidebar.module.css";

import iconInterfaceClose from "@assets/img/interface/close.svg";
import iconInterfaceAccount from "@assets/img/interface/account.svg";
import iconIconsAnalysis from "@assets/img/icons/analysis.png";
import iconIconsArchive from "@assets/img/icons/archive.png";
import iconIconsLearning from "@assets/img/icons/learning.svg";
import iconIconsSettings from "@assets/img/icons/settings.png";

function Sidebar({ style, onClose }: SidebarProps) {
    const { t } = useTranslation("common");

    const { profile, status } = useAuthedProfile();

    return <div
        className={styles.sidebar}
        style={style}
        onClick={event => event.stopPropagation()}
    >
        <div className={styles.titleSection}>
            <img
                className={styles.closeButton}
                src={iconInterfaceClose}
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
                    icon={iconIconsAnalysis}
                    style={{ width: "100%" }}
                >
                    {t("sidebar.analysis")}
                </SidebarTab>

                <SidebarTab
                    url="/archive" 
                    icon={iconIconsArchive} 
                    iconSize="20px"
                    style={{ width: "100%" }}
                >
                    {t("sidebar.archive")}
                </SidebarTab>

                <SidebarTab
                    url="/learning"
                    icon={iconIconsLearning}
                    iconSize="20px"
                    style={{ width: "100%" }}
                >
                    {t("sidebar.learning")}
                </SidebarTab>

                {status == "success" && <SidebarTab
                    url={`/profile/${profile.username}`}
                    icon={iconInterfaceAccount}
                    iconSize="20px"
                    style={{ width: "100%" }}
                >
                    {t("sidebar.profile")}
                </SidebarTab>}
            </div>

            <div className={styles.tabSection}>
                <SidebarTab
                    url="/settings"
                    icon={iconIconsSettings}
                    style={{ width: "100%" }}
                >
                    {t("settings")}
                </SidebarTab>
            </div>
        </div>
    </div>;
}

export default Sidebar;