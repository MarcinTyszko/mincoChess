import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@/components/common/Button/Colour";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";
import TextField from "@/components/common/TextField";
import authClient from "@/lib/auth";

import EmailChangeDialogProps from "./EmailChangeDialogProps";
import * as settingsStyles from "../../index.module.css";
import * as styles from "./EmailChangeDialog.module.css";
import accountErrors from "shared/constants/account/errors";

type VerifyStatus = "unsent" | "sending" | "sent";

const editProfileStrings = "pages.settings.categories.account.editProfile";
const emailVerificationStrings = `${editProfileStrings}.email.verificationButton`;

const buttonColours: Record<VerifyStatus, ButtonColour> = {
    unsent: ButtonColour.BLUE,
    sending: ButtonColour.BLUE,
    sent: ButtonColour.GREEN
};

function EmailChangeDialog({ onClose }: EmailChangeDialogProps) {
    const { t } = useTranslation();

    const [ email, setEmail ] = useState("");
    
    const [ verifyStatus, setVerifyStatus ] = useState<VerifyStatus>("unsent");
    const [ verifyError, setVerifyError ] = useState<string>();

    const buttonMessages = useMemo(() => ({
        unsent: t(`${emailVerificationStrings}.unsent`),
        sending: t(`${emailVerificationStrings}.sending`),
        sent: t(`${emailVerificationStrings}.sent`)
    }), []);

    async function changeEmail() {
        if (verifyStatus == "sent") return;

        setVerifyStatus("sending");

        const response = await authClient.changeEmail({
            callbackURL: "/settings/account",
            newEmail: email
        });

        if (response.error) {
            setVerifyStatus("unsent");
            
            if (response.error.code == "VALIDATION_ERROR") {
                setVerifyError(t(accountErrors.INVALID_EMAIL.message));
            } else if (response.error.code == "EMAIL_IS_THE_SAME") {
                setVerifyError(t(`${editProfileStrings}.email.same`));
            } else {
                setVerifyError(t("unknownError"));
            }

            return;
        }

        setVerifyStatus("sent");
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {t(`${editProfileStrings}.email.verification`)}
        </span>

        <div className={settingsStyles.updateDialogInputContainer}>
            <TextField
                className={settingsStyles.updateDialogInputField}
                placeholder={t("account.placeholders.email")}
                value={email}
                onChange={setEmail}
            />

            {verifyError && <LogMessage>
                {verifyError}    
            </LogMessage>}
        </div>

        <div className={styles.verificationButtonContainer}>
            <Button
                className={styles.verificationButton}
                style={{
                    backgroundColor: buttonColours[verifyStatus],
                    cursor: verifyStatus == "unsent" ? "pointer" : "default"
                }}
                disabled={verifyStatus == "sending"}
                onClick={changeEmail}
            >
                {buttonMessages[verifyStatus]}
            </Button>
        </div>
    </Dialog>;
}

export default EmailChangeDialog;