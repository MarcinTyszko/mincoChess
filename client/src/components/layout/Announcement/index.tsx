import React from "react";

import Button from "@components/common/Button";

import AnnouncementProps from "./AnnouncementProps";
import * as styles from "./Announcement.module.css";

function Announcement({
    children,
    colour,
    setOpen
}: AnnouncementProps) {
    return <div 
        className={styles.wrapper}
        style={{
            backgroundColor: colour
        }}
    >
        {children}

        {
            setOpen
            && <div className={styles.closeButton}>
                <Button 
                    icon={require("@assets/img/close.svg")}
                    iconSize="40px"
                    style={{
                        backgroundColor: colour || "#ff3535",
                        padding: "0"
                    }}
                    onClick={() => setOpen(false)}
                />
            </div>
        }
    </div>;
}

export default Announcement;