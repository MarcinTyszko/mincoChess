import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";

import schemas from "shared/constants/account/schemas";
import AccountError from "shared/constants/account/Error";
import RegistrationAttempt from "@/apps/account/signin/types/RegistrationAttempt";
import useFieldValidation from "@/apps/account/signin/hooks/useFieldValidation";
import useGoogleAuth from "@/apps/account/signin/hooks/useGoogleAuth";
import Separator from "@/components/common/Separator";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";

import * as styles from "../../index.module.css";

function SignUp() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");

    const [
        lastRegistration,
        setLastRegistration
    ] = useState<RegistrationAttempt>();

    const [ status, setStatus ] = useState<StatusMessage>();

    const { getErrorMessage, validateFields } = useFieldValidation();
    const googleLogin = useGoogleAuth("/analysis", setStatus);

    async function register() {
        if (
            email == lastRegistration?.email
            && lastRegistration.timestamp >= (Date.now() - 60000)
        ) return setStatus({
            theme: "error",
            message: t("pages.signIn.errors.verificationCooldown")
        });

        const validationIssue = validateFields(new Map()
            .set(schemas.registration, {
                email, username, password, confirmedPassword
            })
        );

        if (validationIssue) {
            return setStatus(validationIssue);
        }

        const registerResponse = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, username, password, confirmedPassword
            })
        });

        if (registerResponse.status == StatusCodes.TOO_MANY_REQUESTS) {
            return setStatus({
                theme: "error",
                message: t("pages.signIn.errors.verificationCooldown")
            });
        } else if (!registerResponse.ok) {
            return setStatus({
                theme: "error",
                message: getErrorMessage(AccountError.UNKNOWN)
            });
        }

        setStatus({
            theme: "success",
            message: t("pages.signIn.verificationMessage")
        });

        setLastRegistration({
            email, timestamp: Date.now()
        });
    }

    return <div className={styles.wrapper}>
        <div className={styles.dialog}>
            <span className={styles.title}>
                {t("pages.signIn.registerTitle")}
            </span>

            <Button
                icon={require("@assets/img/credits/connections/google.png")}
                iconSize="28px"
                className={styles.submitButton}
                style={{ gap: "10px" }}
                onClick={googleLogin}
            >
                {t("pages.signIn.registerButtonGoogle")}
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
                placeholder={t("pages.signIn.username")}
                onChange={setUsername}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("pages.signIn.password")}
                password
                onChange={setPassword}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("pages.signIn.confirmPassword")}
                password
                onChange={setConfirmedPassword}
            />

            <Button
                icon={require("@assets/img/interface/signin.svg")}
                iconSize="28px"
                className={styles.submitButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                onClick={register}
            >
                {t("pages.signIn.registerButtonEmail")}
            </Button>

            {status && <LogMessage theme={status.theme}>
                {status.message}
            </LogMessage>}

            <Separator style={{ margin: 0 }} />

            <Button className={styles.switchFlowButton} onClick={
                () => navigate("/signin")
            }>
                {t("pages.signIn.loginPageButton")}
            </Button>

            <span className={styles.legalMessage}>
                {t("pages.signIn.legalMessage")}
            </span>
        </div>
    </div>;
}

export default SignUp;