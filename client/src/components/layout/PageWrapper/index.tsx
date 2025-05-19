import React, { useState, useRef, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ToastContainer } from "react-toastify";
import { useShallow } from "zustand/react/shallow";

import useResizeObserver from "@hooks/useResizeObserver";
import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import LoadingPlaceholder from "../LoadingPlaceholder";
import NavigationBar from "../NavigationBar";
import Sidebar from "../sidebar/Sidebar";
import AnnouncementBanner from "../../Announcement";
import BugReportingWidget from "@components/BugReportingWidget";
import getAnnouncement from "@lib/announcement";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

function PageWrapper({ children }: PageWrapperProps) {
    const bugReportingMode = useSettingsStore(
        state => state.settings.bugReportingMode
    );

    const {
        topSectionHeight,
        setContentSectionWidth,
        setTopSectionHeight,
        setContentSectionHeight
    } = useLayoutStore(
        useShallow(state => ({
            topSectionHeight: state.topSectionHeight,
            setTopSectionHeight: state.setTopSectionHeight,
            setContentSectionWidth: state.setContentSectionWidth,
            setContentSectionHeight: state.setContentSectionHeight
        }))
    );

    const [ announcementOpen, setAnnouncementOpen ] = useState(true);

    const topSectionRef = useRef<HTMLDivElement>(null);
    const contentSectionRef = useRef<HTMLDivElement>(null);

    useResizeObserver(topSectionRef, size => (
        setTopSectionHeight(size.fullHeight)
    ));

    useResizeObserver(contentSectionRef, size => {
        setContentSectionWidth(size.fullWidth);
        setContentSectionHeight(size.fullHeight);
    });

    const { data: announcement, status } = useQuery({
        queryKey: ["announcement"],
        queryFn: getAnnouncement,
        refetchOnWindowFocus: false
    });

    return <div>
        <div className={styles.topSection} ref={topSectionRef}>
            {announcementOpen
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
            <Sidebar style={{
                height: `calc(100vh - ${topSectionHeight}px)`
            }}/>

            <div
                className={styles.content}
                style={{
                    height: `calc(100vh - ${topSectionHeight}px)`
                }}
            >
                <Suspense fallback={<LoadingPlaceholder/>}>
                    {children}
                </Suspense>
            </div>
        </div>

        {bugReportingMode && <BugReportingWidget/>}

        <ToastContainer/>
    </div>;
}

export default PageWrapper;