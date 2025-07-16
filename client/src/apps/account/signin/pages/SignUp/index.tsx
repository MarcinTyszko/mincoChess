import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import schemas from "shared/constants/account/schemas";
import accountErrors from "shared/constants/account/errors";
import { validate } from "shared/lib/utils/validate";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import Separator from "@/components/common/Separator";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";
import authClient from "@/lib/auth";

import * as styles from "../../index.module.css";

function SignUp() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();

    const getErrorMessage = useAuthErrors();

    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();

    const [ registrationPending, setRegistrationPending ] = useState(false);

    useEffect(() => {
        // Attempting to login to social when email already exists
        if (searchParams.get("error") != "account_not_linked") return;

        setStatus({
            theme: "error",
            message: getErrorMessage(accountErrors.EMAIL_TAKEN.code)
        });
    }, []);

    function googleLogin() {
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/analysis",
            errorCallbackURL: "/signup"
        });
    }

    async function register() {
        if (password != confirmedPassword) {
            return setStatus({
                theme: "error",
                message: t("account.errors.passwordNoMatch")
            });
        }

        const registration = {
            email: email,
            name: username,
            password: password
        };

        const error = validate(registration, schemas.registration);

        if (error) return setStatus({
            theme: "error",
            message: getErrorMessage(error)
        });

        setRegistrationPending(true);

        const registerResponse = await authClient.signUp.email(registration, {
            onSuccess: () => setStatus({
                theme: "success",
                message: t("account.verificationMessage")
            })
        });

        if (registerResponse.error) setStatus({
            theme: "error",
            message: getErrorMessage(registerResponse.error.code)
        });

        setRegistrationPending(false);
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
                disabled={registrationPending}
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