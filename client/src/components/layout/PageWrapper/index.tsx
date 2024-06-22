import React from "react";

import PageWrapperProps from "./PageWrapperProps";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";

import { SidebarProvider } from "@contexts/SidebarProvider";

import * as styles from "./PageWrapper.module.css";

function PageWrapper({ children }: PageWrapperProps) {
    return <SidebarProvider>
        <NavigationBar/>
        <div className={styles.contentWrapper}>
            <div>
                <Sidebar/>
            </div>

            <div>
                {children}
            </div>
        </div>
    </SidebarProvider>;
}

export default PageWrapper;