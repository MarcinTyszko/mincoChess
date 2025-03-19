import { Router } from "express";

import { createSession } from "../../lib/database/session";
import { verifyCaptchaToken } from "../../lib/captcha";
import SessionType from "../../constants/sessionType";

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

    if (!captchaToken) {
        return res.status(400).send("Please fill out the CAPTCHA.");
    }

    // If Turnstile token is invalid, 400
    if (process.env.NODE_ENV != "development") {
        const captchaTokenValid = await verifyCaptchaToken(
            captchaToken,
            process.env.TURNSTILE_INTERNAL_SECRET_KEY
        );
        
        if (!captchaTokenValid) {
            return res.status(400).send("Please refresh the page and redo the CAPTCHA.");
        }
    }

    // If password is incorrect, 401
    if (password != process.env.ADMIN_PASSWORD) {
        return res.status(401).send("Incorrect password.");
    }

    // Create session
    const sessionToken = await createSession(SessionType.INTERNAL);
    res.send(sessionToken);
});

export default router;