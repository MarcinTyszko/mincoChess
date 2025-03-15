import { Router } from "express";

import { createSession } from "../../lib/database/session";

const router = Router();

interface LoginRequest {
    password?: string;
    captchaToken?: string;
}

router.post("/internal/login", async (req, res) => {
    const { password, captchaToken }: LoginRequest = req.body;

    // If password parameter is missing, 400
    if (!password) {
        return res.status(400).send("Incorrect password.");
    }

    // If ReCAPTCHA token is invalid, 400
    if (process.env.NODE_ENV != "development") {
        const captchaResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_INTERNAL_SECRET_KEY,
                    response: captchaToken
                })
            }
        );
    
        const captchaResult = await captchaResponse.json();
        
        if (!captchaResult.success) {
            return res.status(400).send("Please wait for the CAPTCHA or refresh the page.");
        }
    }

    // If password is incorrect, 401
    if (password != process.env.ADMIN_PASSWORD) {
        return res.status(401).send("Incorrect password.");
    }

    // Create session
    const sessionToken = await createSession();
    res.send(sessionToken);
});

export default router;