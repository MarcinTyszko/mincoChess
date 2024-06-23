import React from "react";

import PageWrapperProps from "./PageWrapperProps";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";

import { SidebarProvider } from "@contexts/SidebarProvider";

import * as styles from "./PageWrapper.module.css";

function PageWrapper({ children }: PageWrapperProps) {
    return <SidebarProvider>
        <NavigationBar/>
        <Sidebar/>
        <div className={styles.contentWrapper}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    </SidebarProvider>;
}

export default PageWrapper;