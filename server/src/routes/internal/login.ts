import { Router } from "express";

import { createSession } from "../../lib/database/session";

const router = Router();

interface LoginRequest {
    password?: string;
    captchaToken?: string;
}

router.post("/internal/login", async (req, res) => {
    const { password, captchaToken }: LoginRequest = req.body;

    // If request any parameters are missing, 400
    if (!password || !captchaToken) {
        return res.status(400).send("Invalid request.");
    }

    // If ReCAPTCHA token is invalid, 400
    if (process.env.NODE_ENV != "development") {
        const captchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `secret=${process.env.RECAPTCHA_CLIENT_SECRET}&response=${captchaToken}`
        });
    
        const captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
            return res.status(400).send("You must complete the CAPTCHA.");
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