import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ToastContainer } from "react-toastify";

import useSettingsStore from "@/stores/SettingsStore";
import Announcement from "../Announcement";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";
import BugReportingWidget from "@/components/BugReportingWidget";
import getAnnouncement from "@/lib/api/announcement";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

function PageWrapper({
    children,
    className,
    style,
    contentClassName,
    contentStyle,
    footerClassName,
    footerStyle
}: PageWrapperProps) {
    const bugReportingMode = useSettingsStore(
        state => state.settings.bugReportingMode
    );

    const [ announcementOpen, setAnnouncementOpen ] = useState(true);

    const { data: announcement } = useQuery({
        queryKey: ["announcement"],
        queryFn: getAnnouncement,
        refetchOnWindowFocus: false
    });

    return <div className={className} style={style}>
        {announcementOpen && announcement?.content
            && <Announcement
                style={{ zIndex: 99 }}
                setOpen={setAnnouncementOpen}
                colour={announcement.colour}
            >
                <ReactMarkdown className={styles.announcementMarkdown}>
                    {announcement.content}
                </ReactMarkdown>
            </Announcement>
        }

        <NavigationBar/>

        <div
            className={`${styles.content} ${contentClassName}`}
            style={contentStyle}
        >
            {children}
        </div>

        <Footer className={footerClassName} style={footerStyle} />

        {bugReportingMode && <BugReportingWidget/>}

        <ToastContainer/>
    </div>;
}

export default PageWrapper;