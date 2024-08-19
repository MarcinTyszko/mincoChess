import React from "react";
import { useNavigate } from "react-router-dom";

import useSidebarStore from "@stores/SidebarStore";
import Breakpoints from "@constants/Breakpoints";

import SidebarTabProps from "./SidebarTabProps";
import * as styles from "./SidebarTab.module.css";

const defaultIconSize = "30px";

function SidebarTab({ 
    children,
    style,
    navigateTo,
    icon,
    iconSize
}: SidebarTabProps) {
    const navigate = useNavigate();
    const { setSidebarOpen } = useSidebarStore();

    function handleClick() {
        navigate(navigateTo);
        
        if (window.innerWidth < Breakpoints.RETRACT_SIDEBAR) {
            setSidebarOpen(false);
        }
    }

    const isTabActive = location.pathname == navigateTo;

    return <button 
        className={styles.sidebarTab} 
        onClick={handleClick}
        style={{
            ...style,
            backdropFilter: isTabActive ? "brightness(1.2)" : ""
        }}
    >
        {
            !!icon
            && <img src={icon} height={iconSize || defaultIconSize} />
        }

        {children}
    </button>;
}

export default SidebarTab;