import React, { useContext, useEffect, useRef } from "react";

import SidebarTab from "../SidebarTab";
import { SidebarContext } from "@contexts/SidebarProvider";

import * as styles from "./Sidebar.module.css";

function Sidebar() {
    const { sidebarOpen } = useContext(SidebarContext);

    const sidebar = useRef<HTMLDivElement>(null);
    const initiallyRendered = useRef<boolean>(false);

    useEffect(() => {
        if (!sidebar.current) return;

        if (!initiallyRendered.current) {
            initiallyRendered.current = true;
            return;
        }
        sidebar.current.style.animationDuration = "0.5s";

        sidebar.current.classList.remove(styles.sidebarClosed);
        sidebar.current.classList.remove(styles.sidebarOpen);

        void sidebar.current.offsetWidth;

        sidebar.current.classList.add(
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        );
    }, [sidebarOpen]);

    return <div className={`${styles.sidebar} ${styles.sidebarClosed}`} ref={sidebar}>
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