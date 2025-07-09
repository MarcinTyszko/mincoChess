import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import schemas from "shared/constants/account/schemas";
import useFieldValidation from "@/hooks/auth/useAuthErrors";
import ButtonColour from "@/components/common/Button/Colour";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";

import * as styles from "../../index.module.css";

function PasswordReset() {
    const { t } = useTranslation();

    const [ searchParams ] = useSearchParams();

    const { validateFields } = useFieldValidation();

    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();

    async function resetPassword() {
        const id = searchParams.get("id");

        if (!id) return setStatus({
            theme: "error",
            message: t("error")
        });

        if (password != confirmPassword) {
            return setStatus({
                theme: "error",
                message: t("pages.signIn.errors.passwordNoMatch")
            });
        }

        const validationIssue = validateFields(new Map()
            .set(schemas.password, password)
        );

        if (validationIssue) return setStatus(validationIssue);

        const resetResponse = await fetch("/auth/update/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, password, confirmPassword })
        });

        if (!resetResponse.ok) return setStatus({
            theme: "error",
            message: t("error")
        });

        location.href = "/signin";
    }

    return <div className={styles.updateDialog}>
        <span className={styles.message}>
            {t("pages.accountUpdate.passwordReset")}
        </span>

        <TextField
            className={styles.field}
            placeholder={t("pages.signIn.password")}
            password
            value={password}
            onChange={setPassword}
        />

        <TextField
            className={styles.field}
            placeholder={t("pages.signIn.confirmPassword")}
            password
            value={confirmPassword}
            onChange={setConfirmPassword}
        />

        {status && <LogMessage theme={status.theme}>
            {status.message}    
        </LogMessage>}

        <Button
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={resetPassword}
        >
            {t("confirm")}
        </Button>
    </div>;
}

export default PasswordReset;