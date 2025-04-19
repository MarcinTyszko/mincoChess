import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ToastContainer } from "react-toastify";

import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import getAnnouncement from "@lib/announcement";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";
import AnnouncementBanner from "../Announcement";
import BugReportingWidget from "@components/BugReportingWidget";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

function PageWrapper({ children }: PageWrapperProps) {
    const bugReportingMode = useSettingsStore(
        state => state.settings.openBeta.bugReportingMode
    );

    const {
        topSectionHeight,
        setTopSectionHeight,
        setContentSectionHeight
    } = useLayoutStore();

    const [ announcementOpen, setAnnouncementOpen ] = useState(true);

    const topSectionRef = useRef<HTMLDivElement>(null);
    const contentSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!topSectionRef.current || !contentSectionRef.current) return;

        const topSectionResizeObserver = new ResizeObserver(entries => {
            setTopSectionHeight(entries[0].target.clientHeight);
        });
        topSectionResizeObserver.observe(topSectionRef.current);

        const contentSectionResizeObserver = new ResizeObserver(entries => {
            setContentSectionHeight(entries[0].target.clientHeight);
        });
        contentSectionResizeObserver.observe(contentSectionRef.current);
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
                && announcement.content
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
            className={styles.contentSection}
            style={{
                marginTop: `${topSectionHeight}px`,
                height: `calc(100vh - ${topSectionHeight}px)`
            }}
            ref={contentSectionRef}
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

        {bugReportingMode && <BugReportingWidget/>}

        <ToastContainer/>
    </div>;
}

export default PageWrapper;