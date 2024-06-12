import React from "react";
import { useNavigate } from "react-router-dom";

import SidebarTabProps from "./SidebarTabProps";

import * as styles from "./SidebarTab.module.css";

function SidebarTab({ children, navigateTo, icon, iconSize }: SidebarTabProps) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(navigateTo);
    }

    return <button 
        className={styles.sidebarTab} 
        onClick={handleClick}
    >
        <img src={icon} height={iconSize || "30px"} />

        {children}
    </button>;
}

export default SidebarTab;