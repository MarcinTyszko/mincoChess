import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { StatusCodes } from "http-status-codes";

import schemas from "shared/constants/account/schemas";
import ButtonColour from "@/components/common/Button/Colour";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";

import * as styles from "../../index.module.css";

function EmailUpdate() {
    const { t } = useTranslation();

    const [ searchParams ] = useSearchParams();

    const [ email, setEmail ] = useState("");
    const [ status, setStatus ] = useState<StatusMessage>();

    async function updateEmail() {
        const id = searchParams.get("id");

        if (!id) return setStatus({
            theme: "error",
            message: t("error")
        });

        if (!schemas.email.safeParse(email).success) {
            return setStatus({
                theme: "error",
                message: t("pages.signIn.errors.invalidEmail")
            });
        }

        const updateResponse = await fetch("/auth/update/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, email })
        });

        if (updateResponse.status == StatusCodes.TOO_MANY_REQUESTS) {
            return setStatus({
                theme: "error",
                message: t("pages.signIn.errors.verificationCooldown")
            });
        } else if (updateResponse.status == StatusCodes.CONFLICT) {
            return setStatus({
                theme: "error",
                message: t("pages.accountUpdate.emailAddressTaken")
            });
        } else if (!updateResponse.ok) {
            return setStatus({ theme: "error", message: t("error") });
        }

        setStatus({
            theme: "success",
            message: t("pages.signIn.verificationMessage")
        });
    }

    return <div className={styles.updateDialog}>
        <span className={styles.message}>
            {t("pages.accountUpdate.emailAddress")}
        </span>

        <TextField
            className={styles.field}
            placeholder={t("pages.signIn.email")}
            value={email}
            onChange={setEmail}
        />

        {status && <LogMessage theme={status.theme}>
            {status.message}    
        </LogMessage>}

        <Button
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={updateEmail}
        >
            {t("confirm")}
        </Button>
    </div>;
}

export default EmailUpdate;