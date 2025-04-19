import React from "react";
import { useNavigate } from "react-router-dom";

import useSidebarStore from "@apps/training/stores/SidebarStore";
import Breakpoints from "@constants/Breakpoints";

import SidebarTabProps from "./SidebarTabProps";
import * as styles from "./SidebarTab.module.css";

const defaultIconSize = "30px";

function SidebarTab({ 
    children,
    className,
    style,
    active,
    navigateTo,
    icon,
    iconSize,
    onClick
}: SidebarTabProps) {
    const navigate = useNavigate();
    const { setSidebarOpen } = useSidebarStore();

    function handleClick() {
        onClick?.();

        if (!navigateTo) return;

        navigate(navigateTo);
        
        if (window.innerWidth < Breakpoints.RETRACT_SIDEBAR) {
            setSidebarOpen(false);
        }
    }

    const isTabActive = active ?? (location.pathname == navigateTo);

    return <button 
        className={`${styles.sidebarTab} ${className}`} 
        onClick={handleClick}
        style={{
            ...style,
            backdropFilter: isTabActive ? "brightness(1.2)" : "",
            boxShadow: isTabActive ? "inset 0 -2px 0 0 var(--ui-blue)" : undefined
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