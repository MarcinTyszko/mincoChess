import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@components/common/Button/Colour";
import Dialog from "@components/common/Dialog";
import Button from "@components/common/Button";

import VerifyState from "./VerifyState";
import EmailVerifyDialogProps from "./EmailVerifyDialogProps";
import * as styles from "./EmailVerifyDialog.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";
const emailVerificationStrings = `${editProfileStrings}.emailVerificationButton`;

function EmailVerifyDialog({
    children,
    onClose,
    onSendVerification
}: EmailVerifyDialogProps) {
    const { t } = useTranslation();
    
    const [ verifyState, setVerifyState ] = useState<VerifyState>("unsent");

    const [ verifyError, setVerifyError ] = useState<string>();

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {children}
        </span>

        <div className={styles.verificationButtonContainer}>
            <Button
                className={styles.verificationButton}
                style={{
                    backgroundColor: verifyState == "sent"
                        ? ButtonColour.GREEN : ButtonColour.BLUE,
                    cursor: verifyState == "unsent" ? "pointer" : "default"
                }}
                disabled={verifyState == "sending"}
                onClick={() => {
                    if (verifyState != "unsent") return;
                    onSendVerification(setVerifyState, setVerifyError);
                }}
            >
                {{
                    unsent: t(`${emailVerificationStrings}.unsent`),
                    sending: t(`${emailVerificationStrings}.sending`),
                    sent: t(`${emailVerificationStrings}.sent`),
                    error: verifyError || t("error")
                }[verifyState]}
            </Button>
        </div>
    </Dialog>;
}

export default EmailVerifyDialog;