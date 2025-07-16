import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import useAuthErrors from "@/hooks/auth/useAuthErrors";
import useAuthErrorReporter from "../../hooks/useAuthErrorReporter";
import Separator from "@/components/common/Separator";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";
import authClient from "@/lib/auth";

import * as styles from "../../index.module.css";

function SignIn() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const getErrorMessage = useAuthErrors();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();

    useAuthErrorReporter(setStatus);

    async function googleLogin() {
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/analysis",
            errorCallbackURL: "/signin"
        });
    }

    async function login() {
        const loginResponse = await authClient.signIn.email({
            email, password,
            callbackURL: "/analysis"
        });

        if (loginResponse.error) setStatus({
            theme: "error",
            message: getErrorMessage(loginResponse.error.code)
        });
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