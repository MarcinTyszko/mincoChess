import React from "react";

import Button from "../Button";
import ButtonColour from "@constants/ButtonColour";

import ConfirmDialogProps from "./ConfirmDialogProps";
import * as styles from "./ConfirmDialog.module.css";
import Dialog from "../Dialog";

function ConfirmDialog({
    setDialogOpen,
    children,
    dangerAction,
    onConfirm
}: ConfirmDialogProps) {
    return <Dialog
        className={styles.dialog}
        setOpen={setDialogOpen}     
    >
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
    </Dialog>;
}

export default ConfirmDialog;