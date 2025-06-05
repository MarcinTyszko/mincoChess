import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import Separator from "@components/common/Separator";
import TextField from "@components/common/TextField";
import Button from "@components/common/Button";
import ButtonColour from "@components/common/Button/Colour";
import LogMessage from "@components/common/LogMessage";

import * as styles from "../../index.module.css";

function SignUp() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const [ error, setError ] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: credentials => {

        },
        onError: () => setError(true)
    });

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
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("pages.signIn.username")}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("pages.signIn.password")}
                password
            />

            <Button
                icon={require("@assets/img/interface/signin.svg")}
                iconSize="28px"
                className={styles.submitButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
            >
                {t("pages.signIn.registerButtonEmail")}
            </Button>

            {error && <LogMessage>
                {t("pages.signIn.registerError")}    
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