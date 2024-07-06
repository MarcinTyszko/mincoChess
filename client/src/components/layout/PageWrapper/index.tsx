import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

const queryClient = new QueryClient();

function PageWrapper({ children }: PageWrapperProps) {
    return <QueryClientProvider client={queryClient}>
        <NavigationBar/>
        <Sidebar/>
        
        <div className={styles.contentWrapper}>
            <div className={styles.content}>
                {children}
            </div>
        </div>

        <ReactQueryDevtools/>
    </QueryClientProvider>;
}

export default PageWrapper;