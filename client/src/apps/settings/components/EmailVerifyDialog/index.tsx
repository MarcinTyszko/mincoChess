import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@/components/common/Button/Colour";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";

import EmailVerifyDialogProps from "./EmailVerifyDialogProps";
import * as styles from "./EmailVerifyDialog.module.css";

type VerifyStatus = "unsent" | "sending" | "sent" | "error";

const editProfileStrings = "pages.settings.categories.account.editProfile";
const emailVerificationStrings = `${editProfileStrings}.email.verificationButton`;

const buttonColours: Record<VerifyStatus, ButtonColour> = {
    unsent: ButtonColour.BLUE,
    sending: ButtonColour.BLUE,
    sent: ButtonColour.GREEN,
    error: ButtonColour.RED
};

function EmailVerifyDialog({
    children,
    onClose,
    onSendVerification
}: EmailVerifyDialogProps) {
    const { t } = useTranslation();
    
    const [ verifyState, setVerifyState ] = useState<VerifyStatus>("unsent");
    const [ verifyError, setVerifyError ] = useState<string>();

    const buttonMessages = useMemo(() => ({
        unsent: t(`${emailVerificationStrings}.unsent`),
        sending: t(`${emailVerificationStrings}.sending`),
        sent: t(`${emailVerificationStrings}.sent`),
        error: t("error")
    }), []);

    async function handleVerifyClick() {
        if (verifyState != "unsent") return;

        setVerifyState("sending");

        try {
            await onSendVerification();
        } catch (err) {
            setVerifyState("error");
            setVerifyError((err as Error).message);
            return;
        }
        
        setVerifyState("sent");
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {children}
        </span>

        {verifyError && <LogMessage>
            {verifyError}    
        </LogMessage>}

        <div className={styles.verificationButtonContainer}>
            <Button
                className={styles.verificationButton}
                style={{
                    backgroundColor: buttonColours[verifyState],
                    cursor: verifyState == "unsent" ? "pointer" : "default"
                }}
                disabled={verifyState == "sending"}
                onClick={handleVerifyClick}
            >
                {buttonMessages[verifyState]}
            </Button>
        </div>
    </Dialog>;
}

export default EmailVerifyDialog;