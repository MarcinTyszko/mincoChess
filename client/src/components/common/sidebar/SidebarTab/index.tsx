import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import SidebarTabProps from "./SidebarTabProps";
import { SidebarContext } from "@contexts/SidebarProvider";

import * as styles from "./SidebarTab.module.css";

function SidebarTab({ 
    children,
    navigateTo,
    icon,
    iconSize
}: SidebarTabProps) {
    const navigate = useNavigate();
    const { setSidebarOpen } = useContext(SidebarContext);

    function handleClick() {
        navigate(navigateTo);
        setSidebarOpen(false);
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