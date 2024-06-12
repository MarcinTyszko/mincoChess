import React from "react";

import PageWrapperProps from "./PageWrapperProps";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";

import * as styles from "./PageWrapper.module.css";

function PageWrapper({ children }: PageWrapperProps) {
    return <>
        <NavigationBar/>
        <div className={styles.pageWrapper}>
            <div>
                <Sidebar/>
            </div>

            <div>
                {children}
            </div>
        </div>
    </>;
}

export default PageWrapper;