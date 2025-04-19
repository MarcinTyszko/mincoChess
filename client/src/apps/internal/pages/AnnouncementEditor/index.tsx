import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Announcement } from "wintrchess";
import fetchAnnouncement from "@lib/announcement";
import AnnouncementBanner from "@components/layout/Announcement";
import ColourSwatch from "@components/common/ColourSwatch";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import ConfirmDialog from "@components/common/ConfirmDialog";
import TextField from "@components/common/TextField";

import * as styles from "./AnnouncementEditor.module.css";

function AnnouncementEditor() {
    const [ bannerColour, setBannerColour ] = useState("#000");
    const [ bannerColourPickerOpen, setBannerColourPickerOpen ] = useState(false);

    const [ bannerContent, setBannerContent ] = useState("");

    const [ publishConfirmOpen, setPublishConfirmOpen ] = useState(false);
    const [ clearConfirmOpen, setClearConfirmOpen ] = useState(false);

    const queryClient = new QueryClient();

    const { data: announcement } = useQuery({
        queryKey: ["announcement"],
        queryFn: fetchAnnouncement
    });

    useEffect(() => {
        if (!announcement) return;
        if (!announcement.colour) return;
        if (!announcement.content) return;

        setBannerColour(announcement.colour);
        setBannerContent(announcement.content);
    }, [announcement]);

    async function publishAnnouncement({ colour, content }: Announcement) {
        await fetch("/internal/announcement/publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ colour, content })
        });

        queryClient.refetchQueries({
            queryKey: ["announcement"]
        });

        if (content) {
            toast.success(
                "Announcement published!",
                {
                    position: "bottom-left",
                    theme: "dark",
                    pauseOnHover: false,
                    closeOnClick: true,
                    closeButton: false,
                    style: {
                        fontFamily: "JetBrains Mono"
                    }
                }
            );
        } else {
            toast.error(
                "Announcement cleared.",
                {
                    position: "bottom-left",
                    theme: "dark",
                    pauseOnHover: false,
                    closeOnClick: true,
                    closeButton: false,
                    style: {
                        fontFamily: "JetBrains Mono"
                    }
                }
            );
        }
    }

    return <div
        className={styles.wrapper}
        onClick={() => setBannerColourPickerOpen(false)}
    >
        <h1>Edit</h1>

        <div className={styles.editor}>
            <TextField
                placeholder="Announcement..."
                onChange={setBannerContent}
                value={bannerContent}
                style={{
                    borderRadius: "10px",
                    border: "3px solid #242424"
                }}
            />

            <ColourSwatch
                colour={bannerColour}
                onColourChange={setBannerColour}
                open={bannerColourPickerOpen}
                onToggle={setBannerColourPickerOpen}
            />
        </div>

        <h1>Preview</h1>

        <div className={styles.announcementPreview}>
            <AnnouncementBanner
                colour={bannerColour}
                style={{ zIndex: 0 }}
            >
                <ReactMarkdown className={styles.announcementMarkdown}>
                    {bannerContent}
                </ReactMarkdown>
            </AnnouncementBanner>
        </div>

        <div className={styles.buttonBar}>
            <Button
                icon={require("@assets/img/interface/edit.svg")}
                style={{
                    gap: "5px",
                    backgroundColor: ButtonColour.BLUE
                }}
                onClick={() => setPublishConfirmOpen(true)}
            >
                Publish
            </Button>

            <Button
                icon={require("@assets/img/interface/delete.svg")}
                style={{
                    gap: "5px",
                    backgroundColor: ButtonColour.RED
                }}
                onClick={() => setClearConfirmOpen(true)}
            >
                Clear
            </Button>
        </div>

        {
            publishConfirmOpen
            && <ConfirmDialog
                setDialogOpen={setPublishConfirmOpen}
                onConfirm={() => publishAnnouncement({
                    colour: bannerColour,
                    content: bannerContent
                })}
            >
                Are you sure you want to publish this announcement?
            </ConfirmDialog>
        }

        {
            clearConfirmOpen
            && <ConfirmDialog
                setDialogOpen={setClearConfirmOpen}
                onConfirm={() => publishAnnouncement({})}
                dangerAction
            >
                Are you sure you want to clear the announcement?
            </ConfirmDialog>
        }
    </div>;
}

export default AnnouncementEditor;