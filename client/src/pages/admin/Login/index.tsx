import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Turnstile, { useTurnstile } from "react-turnstile";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import TextField from "@components/common/TextField";
import ErrorMessage from "@components/common/ErrorMessage";

import * as styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();

    const turnstile = useTurnstile();

    const [ password, setPassword ] = useState("");

    const [ error, setError ] = useState("");

    const [ captchaToken, setCaptchaToken ] = useState<string | null>(null);

    async function login() {
        const loginResponse = await fetch("/internal/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                captchaToken
            })
        });

        if (!loginResponse.ok) {
            setError(await loginResponse.text());
            turnstile.reset();

            return;
        }

        navigate("/internal/dashboard");
    }

    return <div className={styles.wrapper}>
        <img
            src={require("@assets/img/logo.svg")}
            height={100}
            draggable={false}
        />

        <TextField
            style={{
                width: "min(300px, 100%)",
                height: "50px",
                borderRadius: "10px"
            }}
            placeholder="Password..."
            password
            onChange={setPassword}
        />

        {
            process.env.TURNSTILE_INTERNAL_SITE_KEY
            && <Turnstile
                sitekey={process.env.TURNSTILE_INTERNAL_SITE_KEY}
                theme="dark"
                onSuccess={setCaptchaToken}
            />
        }

        <Button
            style={{
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={login}
        >
            Login
        </Button>

        {
            error
            && <ErrorMessage
                style={{ maxWidth: "400px" }}
            >
                {error}
            </ErrorMessage>
        }
    </div>;
}

export default Login;