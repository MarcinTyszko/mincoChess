import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { Cookie } from "wintrchess";
import { signInternalJWT } from "@lib/authentication";
import { verifyCaptchaToken } from "@lib/captcha";

const path = "/internal/login";

const router = Router();

interface LoginRequest {
    password?: string;
    captchaToken?: string;
}

router.use(path, express.json());

router.post(path, async (req, res) => {
    const { password, captchaToken }: LoginRequest = req.body;

    // If parameters are missing
    if (!password) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Incorrect password.");
    }

    // If Turnstile token is invalid, 400
    if (process.env.NODE_ENV != "development") {
        if (!captchaToken) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Please fill out the CAPTCHA.");
        }

        const captchaTokenValid = await verifyCaptchaToken(
            captchaToken,
            process.env.TURNSTILE_INTERNAL_SECRET_KEY
        );
        
        if (!captchaTokenValid) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Please refresh the page and redo the CAPTCHA.");
        }
    }

    // If password is incorrect, 401
    if (password != process.env.INTERNAL_PASSWORD) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Incorrect password.");
    }

    // Create session
    try {
        res.cookie(
            Cookie.INTERNAL_JWT,
            signInternalJWT(),
            {
                sameSite: true,
                httpOnly: true
            }
        );
    
        res.sendStatus(StatusCodes.OK);
    } catch {
        res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
    }
});

export default router;