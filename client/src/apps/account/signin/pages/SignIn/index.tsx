import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";

import schemas from "shared/constants/account/schemas";
import AccountError from "shared/constants/account/Error";
import useFieldValidation from "@/apps/account/signin/hooks/useFieldValidation";
import useGoogleAuth from "@/apps/account/signin/hooks/useGoogleAuth";
import Separator from "@/components/common/Separator";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";

import * as styles from "../../index.module.css";

function SignIn() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();
    
    const { getErrorMessage, validateFields } = useFieldValidation();
    const googleLogin = useGoogleAuth("/analysis", setStatus);

    async function login() {
        const validationIssue = validateFields(new Map()
            .set(schemas.email, email)
            .set(schemas.password, password)
        );

        if (validationIssue) {
            return setStatus(validationIssue);
        }

        const loginResponse = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });

        if (loginResponse.status == StatusCodes.UNAUTHORIZED) {
            return setStatus({
                theme: "error",
                message: getErrorMessage(AccountError.INCORRECT_PASSWORD)
            });
        } else if (!loginResponse.ok) {
            return setStatus({
                theme: "error",
                message: getErrorMessage(AccountError.UNKNOWN)
            });
        }

        location.href = "/analysis";
    }

    return <div className={styles.wrapper}>
        <div className={styles.dialog}>
            <span className={styles.title}>
                {t("pages.signIn.loginTitle")}
            </span>

            <Button
                icon={require("@assets/img/credits/connections/google.png")}
                iconSize="28px"
                className={styles.submitButton}
                style={{ gap: "10px" }}
                onClick={googleLogin}
            >
                {t("pages.signIn.loginButtonGoogle")}
            </Button>

            <Separator style={{ margin: 0 }}>
                <b>{t("pages.signIn.alternative")}</b>
            </Separator>

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("pages.signIn.email")}
                onChange={setEmail}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("pages.signIn.password")}
                password
                onChange={setPassword}
            />

            <Button
                icon={require("@assets/img/interface/signin.svg")}
                iconSize="28px"
                className={styles.submitButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                onClick={login}
            >
                {t("pages.signIn.loginButtonEmail")}
            </Button>

            {status && <LogMessage theme={status.theme}>
                {status.message}
            </LogMessage>}

            <Separator style={{ margin: 0 }} />

            <Button className={styles.switchFlowButton} onClick={
                () => navigate("/signup")
            }>
                {t("pages.signIn.registerPageButton")}
            </Button>

            <span className={styles.legalMessage}>
                {t("pages.signIn.legalMessage")}
            </span>
        </div>
    </div>;
}

export default SignIn;