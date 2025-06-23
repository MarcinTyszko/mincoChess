import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@components/common/Button/Colour";
import Dialog from "@components/common/Dialog";
import TextField from "@components/common/TextField";
import Button from "@components/common/Button";

import UsernameChangeDialogProps from "./UsernameChangeDialogProps";
import * as styles from "./UsernameChangeDialog.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

function UsernameChangeDialog({ onClose }: UsernameChangeDialogProps) {
    const { t } = useTranslation();

    const [ password, setPassword ] = useState("");

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {t(`${editProfileStrings}.usernameChange`)}
        </span>

        <TextField
            className={styles.passwordField}
            placeholder={t("pages.signIn.password")}
            password
            value={password}
            onChange={setPassword}
        />

        <div className={styles.changeButtonContainer}>
            <Button
                className={styles.changeButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
            >
                {t(`${editProfileStrings}.usernameChangeButton`)}
            </Button>
        </div>
    </Dialog>;
}

export default UsernameChangeDialog;