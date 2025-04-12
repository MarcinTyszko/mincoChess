import React from "react";
import { Outlet } from "react-router-dom";

import useProtectedRoute from "@hooks/useProtectedRoute";
import SidebarTab from "@components/layout/sidebar/SidebarTab";

import * as styles from "./Dashboard.module.css";

function Dashboard() {
    useProtectedRoute();

    return <div className={styles.wrapper}>
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
                News Posts
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