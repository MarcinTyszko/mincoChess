import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha";

import { Cookie } from "wintrchess";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";

import * as styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();

    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");

    const captchaRef = useRef<ReCAPTCHA>(null);

    const cookies = new Cookies();

    async function login() {
        const captchaToken = captchaRef.current?.getValue();

        const sessionResponse = await fetch("/internal/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password, captchaToken })
        });
        const sessionText = await sessionResponse.text();

        if (!sessionResponse.ok) {
            captchaRef.current?.reset();
            setError(sessionText);
            
            return;
        }

        cookies.set(Cookie.ADMIN_SESSION_TOKEN, sessionText);

        navigate("/internal/dashboard");
    }

    return <div className={styles.wrapper}>
        <img
            src={require("@assets/img/logo.svg")}
            height={100}
        />

        <input
            className={styles.password} 
            type="password"
            placeholder="Password..."
            onChange={event => setPassword(event.target.value)}
        />

        <ReCAPTCHA
            sitekey={process.env.RECAPTCHA_SITE_KEY || ""}
            ref={captchaRef}
        />

        <Button
            style={{
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={login}
        >
            Login
        </Button>

        <span className={styles.error}>
            {error}
        </span>
    </div>;
}

export default Login;