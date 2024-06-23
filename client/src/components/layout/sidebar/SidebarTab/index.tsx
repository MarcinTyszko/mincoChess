import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import SidebarTabProps from "./SidebarTabProps";
import { SidebarContext } from "@contexts/SidebarProvider";
import Breakpoints from "@constants/Breakpoints";

import * as styles from "./SidebarTab.module.css";

const defaultIconSize = "30px";

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
        
        if (window.innerWidth < Breakpoints.RETRACT_SIDEBAR) {
            setSidebarOpen(false);
        }
    }

    return <button 
        className={styles.sidebarTab} 
        onClick={handleClick}
    >
        <img src={icon} height={iconSize || defaultIconSize} />

        {children}
    </button>;
}

export default SidebarTab;