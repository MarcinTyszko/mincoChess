import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactMarkdown from "react-markdown";
import { ToastContainer } from "react-toastify";

import getAnnouncement from "@lib/announcement";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";
import AnnouncementBanner from "../Announcement";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

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

    const { data: announcement, status } = useQuery({
        queryKey: ["announcement"],
        queryFn: getAnnouncement,
        refetchOnWindowFocus: false
    });

    return <div>
        <div 
            className={styles.topSection} 
            ref={topSectionRef}
        >
            {
                announcementOpen
                && status == "success"
                && !!announcement.content
                && <AnnouncementBanner
                    setOpen={setAnnouncementOpen}
                    colour={announcement.colour}
                >
                    <ReactMarkdown className={styles.announcementMarkdown}>
                        {announcement.content}
                    </ReactMarkdown>
                </AnnouncementBanner>
            }

            <NavigationBar/>
        </div>
        
        <div 
            className={styles.contentWrapper}
            style={{
                marginTop: `${topSectionHeight}px`,
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

        <ToastContainer/>
        <ReactQueryDevtools/>
    </div>;
}

export default PageWrapper;