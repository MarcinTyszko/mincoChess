import React, { useContext, useEffect, useRef } from "react";

import SidebarTab from "../SidebarTab";
import { SidebarContext } from "@contexts/SidebarProvider";

import * as styles from "./Sidebar.module.css";

function Sidebar() {
    const { sidebarOpen } = useContext(SidebarContext);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const initiallyRendered = useRef<boolean>(false);

    useEffect(() => {
        if (!sidebarRef.current) return;
        const sidebar = sidebarRef.current;

        if (!initiallyRendered.current) {
            initiallyRendered.current = true;
            return;
        }

        sidebar.style.animationDuration = "0.5s";

        sidebar.classList.remove(styles.sidebarClosed);
        sidebar.classList.remove(styles.sidebarOpen);

        void sidebar.offsetWidth;

        sidebar.classList.add(
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        );
    }, [sidebarOpen]);

    return <div 
        className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`} 
        ref={sidebarRef}
    >
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