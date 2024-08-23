import React from "react";

import Button from "../Button";
import ButtonColour from "@constants/ButtonColour";
import DialogCloseButton from "../DialogCloseButton";

import ConfirmDialogProps from "./ConfirmDialogProps";
import * as styles from "./ConfirmDialog.module.css";

function ConfirmDialog({
    setDialogOpen,
    children,
    dangerAction,
    onConfirm
}: ConfirmDialogProps) {
    return <div className={styles.wrapper}>
        <div className={styles.dialog}>
            <DialogCloseButton onClick={() => setDialogOpen(false)} />

            {children}

            <div className={styles.options}>
                <Button
                    onClick={() => {
                        setDialogOpen(false);
                        onConfirm();
                    }}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: dangerAction ?
                            ButtonColour.RED
                            : ButtonColour.BLUE
                    }}
                >
                    Yes
                </Button>

                <Button
                    onClick={() => setDialogOpen(false)}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#242424"
                    }}
                >
                    No
                </Button>
            </div>
        </div>
    </div>;
}

export default ConfirmDialog;