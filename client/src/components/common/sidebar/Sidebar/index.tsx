import React from "react";

import SidebarTab from "@components/common/sidebar/SidebarTab";

import * as styles from "./Sidebar.module.css";

function Sidebar() {
    return <div className={styles.sidebar}>
        <SidebarTab 
            navigateTo="/" 
            icon={require("@assets/img/analysis.svg")}
        >
            Analysis
        </SidebarTab>

        <SidebarTab 
            navigateTo="/archive" 
            icon={require("@assets/img/archive.svg")} 
            iconSize="20px"
        >
            Archive
        </SidebarTab>
    </div>;
}

export default Sidebar;