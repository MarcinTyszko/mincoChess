import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import ColourSwatch from "@components/common/ColourSwatch";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import ConfirmDialog from "@components/common/ConfirmDialog";
import useProtectedRoute from "@hooks/useProtectedRoute";

import * as styles from "./AnnouncementEditor.module.css";

function AnnouncementEditor() {
    useProtectedRoute();

    const [ bannerColour, setBannerColour ] = useState("#000");
    const [ bannerColourPickerOpen, setBannerColourPickerOpen ] = useState(false);

    const [ bannerContent, setBannerContent ] = useState("");

    const [ publishConfirmOpen, setPublishConfirmOpen ] = useState(false);

    return <div
        className={styles.wrapper}
        onClick={() => setBannerColourPickerOpen(false)}
    >
        <h1>Edit</h1>

        <div className={styles.editor}>
            <input
                className={styles.announcementBox}
                value={bannerContent}
                onChange={event => setBannerContent(event.target.value)}
                type="text"
            />

            <ColourSwatch
                colour={bannerColour}
                setColour={setBannerColour}
                open={bannerColourPickerOpen}
                setOpen={setBannerColourPickerOpen}
            />
        </div>

        <h1>Preview</h1>

        <div
            className={styles.announcementBox}
            style={{
                backgroundColor: bannerColour
            }}
        >
            <ReactMarkdown>
                {bannerContent}
            </ReactMarkdown>
        </div>

        <Button
            icon={require("@assets/img/edit.svg")}
            style={{
                gap: "5px",
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={() => setPublishConfirmOpen(true)}
        >
            Publish
        </Button>

        {
            publishConfirmOpen
            && <ConfirmDialog
                setDialogOpen={setPublishConfirmOpen}
                onConfirm={() => null}
            >
                Are you sure you want to publish this announcement?
            </ConfirmDialog>
        }
    </div>;
}

export default AnnouncementEditor;