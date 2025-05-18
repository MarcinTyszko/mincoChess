import React from "react";
import { useTranslation } from "react-i18next";

import Button from "../Button";
import ButtonColour from "@components/common/Button/Colour";

import ConfirmDialogProps from "./ConfirmDialogProps";
import * as styles from "./ConfirmDialog.module.css";
import Dialog from "../Dialog";

function ConfirmDialog({
    setDialogOpen,
    children,
    dangerAction,
    onConfirm
}: ConfirmDialogProps) {
    const { t } = useTranslation();

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
                {t("confirmDialog.yes")}
            </Button>

            <Button
                onClick={() => setDialogOpen(false)}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#242424"
                }}
            >
                {t("confirmDialog.no")}
            </Button>
        </div>
    </Dialog>;
}

export default ConfirmDialog;