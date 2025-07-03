import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonColour from "@/components/common/Button/Colour";
import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import LogMessage from "@/components/common/LogMessage";

import * as styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();

    const [ password, setPassword ] = useState("");

    const [ error, setError ] = useState("");

    async function login() {
        const loginResponse = await fetch("/internal/login", {
            method: "POST",
            body: password
        });

        if (!loginResponse.ok) {
            return setError(await loginResponse.text());
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

        <Button
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={login}
        >
            Login
        </Button>

        {error && <LogMessage style={{ maxWidth: "400px" }}>
            {error}
        </LogMessage>}
    </div>;
}

export default Login;