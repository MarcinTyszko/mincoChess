import React from "react";

import PageWrapperProps from "./PageWrapperProps";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";

import * as styles from "./PageWrapper.module.css";

function PageWrapper({ children }: PageWrapperProps) {
    return <>
        <NavigationBar/>
        <Sidebar/>
        
        <div className={styles.contentWrapper}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    </>;
}

export default PageWrapper;