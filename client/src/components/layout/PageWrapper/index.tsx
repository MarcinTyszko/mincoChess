import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";
import Announcement from "../Announcement";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

const queryClient = new QueryClient();

function PageWrapper({ children }: PageWrapperProps) {
    const [ topSectionHeight, setTopSectionHeight ] = useState(0);
    const [ announcementOpen, setAnnouncementOpen ] = useState(true);

    const topSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!topSectionRef.current) return;

        const topSectionResizeObserver = new ResizeObserver(entries => {
            setTopSectionHeight(entries[0].target.clientHeight);
        });

        topSectionResizeObserver.observe(topSectionRef.current);
    }, []);

    return <QueryClientProvider client={queryClient}>
        <div 
            className={styles.topSection} 
            ref={topSectionRef}
        >
            {
                announcementOpen
                && <Announcement
                    setOpen={setAnnouncementOpen}
                    colour="rgb(255, 74, 29)"
                >
                    <span>
                        <span>🎉 We've rebuilt Game Report from the ground up! Read </span>

                        <Link 
                            to="/news/thing"
                            style={{
                                textDecorationColor: "#47acff",
                                color: "#ffffff"
                            }}
                        >
                            <b>the full changelog</b>
                        </Link>

                        .
                    </span>
                </Announcement>
            }

            <NavigationBar/>
        </div>
        
        <div 
            className={styles.contentWrapper}
            style={{
                height: `calc(100vh - ${topSectionHeight}px)`
            }}
        >
            <Sidebar
                style={{
                    height: `calc(100vh - ${topSectionHeight}px)`
                }}
            />

            <div className={styles.content}>
                {children}
            </div>
        </div>

        <ReactQueryDevtools/>
    </QueryClientProvider>;
}

export default PageWrapper;