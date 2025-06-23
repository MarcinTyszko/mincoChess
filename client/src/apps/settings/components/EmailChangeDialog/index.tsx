import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@components/common/Button/Colour";
import Dialog from "@components/common/Dialog";
import Button from "@components/common/Button";

import EmailChangeDialogProps from "./EmailChangeDialogProps";
import * as styles from "./EmailChangeDialog.module.css";

type VerifyState = "unsent" | "sending" | "sent" | "error";

const editProfileStrings = "pages.settings.categories.account.editProfile";
const emailVerificationStrings = `${editProfileStrings}.emailVerificationButton`;

function EmailChangeDialog({ onClose }: EmailChangeDialogProps) {
    const { t } = useTranslation();
    
    const [ verifyState, setVerifyState ] = useState<VerifyState>("unsent");

    const [ verifyError, setVerifyError ] = useState<string>();

    function sendVerificationEmail() {
        // Mock verification process

        setVerifyState("sending");

        setTimeout(() => setVerifyState("sent"), 1000);
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {t(`${editProfileStrings}.emailVerification`)}
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
                    if (verifyState == "unsent") sendVerificationEmail();
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

export default EmailChangeDialog;