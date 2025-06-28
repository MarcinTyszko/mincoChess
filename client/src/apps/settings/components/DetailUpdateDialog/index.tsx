import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@components/common/Button/Colour";
import Dialog from "@components/common/Dialog";
import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import LogMessage from "@components/common/LogMessage";

import DetailUpdateDialogProps from "./DetailUpdateDialogProps";
import * as styles from "./DetailUpdateDialog.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

function DetailUpdateDialog({
    children,
    buttonStyle,
    placeholder,
    fields = "input",
    onClose,
    onConfirm,
    getErrorMessage,
    buttonDisabled
}: DetailUpdateDialogProps) {
    const { t } = useTranslation();

    const [ input, setInput ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ error, setError ] = useState<string>();

    useEffect(() => {
        setError(getErrorMessage?.(input, password));
    }, [input]);

    async function handleConfirmClick() {
        try {
            await onConfirm(input, password);
            onClose();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {children}
        </span>

        <div className={styles.inputContainer}>
            {(fields == "input" || fields == "both") && <TextField
                className={styles.inputField}
                placeholder={placeholder}
                value={input}
                onChange={setInput}
            />}

            {(fields == "password" || fields == "both") && <TextField
                className={styles.inputField}
                placeholder={t("pages.signIn.password")}
                password
                value={password}
                onChange={setPassword}
            />}

            {error && <LogMessage className={styles.error}>
                {t(error)}    
            </LogMessage>}
        </div>

        <div className={styles.confirmButtonContainer}>
            <Button
                className={styles.confirmButton}
                style={{
                    backgroundColor: ButtonColour.BLUE,
                    ...buttonStyle
                }}
                disabled={!!error || buttonDisabled?.(input, password)}
                onClick={handleConfirmClick}
            >
                {t(`${editProfileStrings}.confirmButton`)}
            </Button>
        </div>
    </Dialog>;
}

export default DetailUpdateDialog;