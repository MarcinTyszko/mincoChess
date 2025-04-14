import React from "react";
import { Outlet } from "react-router-dom";

import SidebarTab from "@components/layout/sidebar/SidebarTab";

import * as styles from "./Dashboard.module.css";

function Dashboard() {
    return <div className={styles.wrapper}>
        <h1 className={styles.title}>
            <img
                src={require("@assets/img/logo.svg")}
                height={45}
            />

            Internal
        </h1>

        <div className={styles.tabs}>
            <SidebarTab
                navigateTo="/internal/dashboard/analytics"
                icon={require("@assets/img/analytics.svg")}
            >
                Analytics
            </SidebarTab>

            <SidebarTab
                navigateTo="/internal/dashboard/news"
                icon={require("@assets/img/news-icon.svg")}
            >
                News Articles
            </SidebarTab>

            <SidebarTab
                navigateTo="/internal/dashboard/announcement"
                icon={require("@assets/img/announcement.svg")}
            >
                Announcement
            </SidebarTab>
        </div>

        <Outlet/>
    </div>;
}

export default Dashboard;