import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@components/common/Button/Colour";
import Dialog from "@components/common/Dialog";
import TextField from "@components/common/TextField";
import Button from "@components/common/Button";

import PasswordConfirmDialogProps from "./PasswordConfirmDialogProps";
import * as styles from "./PasswordConfirmDialog.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

function PasswordConfirmDialog({
    children,
    buttonStyle,
    onClose,
    onConfirm
}: PasswordConfirmDialogProps) {
    const { t } = useTranslation();

    const [ password, setPassword ] = useState("");

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {children}
        </span>

        <TextField
            className={styles.passwordField}
            placeholder={t("pages.signIn.password")}
            password
            value={password}
            onChange={setPassword}
        />

        <div className={styles.confirmButtonContainer}>
            <Button
                className={styles.confirmButton}
                style={{
                    backgroundColor: ButtonColour.BLUE,
                    ...buttonStyle
                }}
                onClick={() => onConfirm(password)}
            >
                {t(`${editProfileStrings}.confirmButton`)}
            </Button>
        </div>
    </Dialog>;
}

export default PasswordConfirmDialog;