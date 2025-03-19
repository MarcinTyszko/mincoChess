import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import Turnstile, { useTurnstile } from "react-turnstile";

import { Cookie } from "wintrchess";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import ErrorMessage from "@components/common/ErrorMessage";

import * as styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();

    const turnstile = useTurnstile();

    const [ password, setPassword ] = useState("");

    const [ error, setError ] = useState("");

    const [ captchaToken, setCaptchaToken ] = useState<string | null>(null);

    const cookies = new Cookies();

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

        const responseText = await loginResponse.text();

        if (!loginResponse.ok) {
            setError(responseText);
            turnstile.reset();

            return;
        }

        cookies.set(Cookie.INTERNAL_SESSION_TOKEN, responseText);

        navigate("/internal/dashboard");
    }

    return <div className={styles.wrapper}>
        <img
            src={require("@assets/img/logo.svg")}
            height={100}
            draggable={false}
        />

        <input
            className={styles.password} 
            type="password"
            placeholder="Password..."
            onChange={event => setPassword(event.target.value)}
        />

        {
            process.env.TURNSTILE_INTERNAL_SITE_KEY
            && <Turnstile
                sitekey={process.env.TURNSTILE_INTERNAL_SITE_KEY}
                theme="dark"
                onSuccess={token => {
                    console.log(`Turnstile successful. Token: ${token}`);
                    
                    setCaptchaToken(token);
                }}
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