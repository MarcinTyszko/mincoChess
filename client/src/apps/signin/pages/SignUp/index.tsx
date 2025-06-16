import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { AccountError } from "wintrchess";
import useAccountErrors from "@apps/signin/hooks/useAccountErrors";
import Separator from "@components/common/Separator";
import TextField from "@components/common/TextField";
import Button from "@components/common/Button";
import ButtonColour from "@components/common/Button/Colour";
import LogMessage from "@components/common/LogMessage";

import * as styles from "../../index.module.css";

function SignUp() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const getErrorMessage = useAccountErrors();

    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    
    const [ error, setError ] = useState<string>();
    const [ successMessage, setSuccessMessage ] = useState<string>();

    const googleLogin = useGoogleLogin({
        onSuccess: async credentials => {
            await fetch("/auth/google", {
                method: "POST",
                body: credentials.code
            });

            location.href = "/analysis";
        },
        onError: () => setError(
            getErrorMessage(AccountError.UNKNOWN)
        ),
        flow: "auth-code"
    });

    async function register() {
        const registerResponse = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, username, password
            })
        });

        if (!registerResponse.ok) return setError(
            getErrorMessage((await registerResponse.text()) as AccountError)
        );

        setError(undefined);
        setSuccessMessage(
            t("pages.signIn.verificationMessage")
        );
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
                onClick={() => googleLogin()}
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

            <Button
                icon={require("@assets/img/interface/signin.svg")}
                iconSize="28px"
                className={styles.submitButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                onClick={register}
            >
                {t("pages.signIn.registerButtonEmail")}
            </Button>

            {error && <LogMessage>
                {error}
            </LogMessage>}

            {successMessage && <LogMessage theme="success">
                {successMessage}    
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