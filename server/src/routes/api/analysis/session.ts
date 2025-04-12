import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { Cookie } from "wintrchess";
import { verifyCaptchaToken } from "@lib/captcha";
import AnalysisSession from "@database/models/AnalysisSession";

const path = "/api/analysis/session";

const router = Router();

interface SessionRequest {
    token?: string;
}

const defaultSessionActions = 80;

router.use(path, express.json());

router.post(path, async (req, res) => {
    const { token }: SessionRequest = req.body;

    // If token missing
    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("CAPTCHA Token required.");
    }

    // Verify captcha token
    const captchaTokenValid = await verifyCaptchaToken(
        token,
        process.env.TURNSTILE_ANALYSIS_SECRET_KEY
    );

    if (!captchaTokenValid) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("CAPTCHA Token invalid.");
    }

    // Do not replace existing valid session
    const existingSessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (existingSessionToken) {
        const existingSession = await AnalysisSession.findOne({
            token: existingSessionToken
        });

        if (existingSession) {
            return res.sendStatus(StatusCodes.OK);
        }
    }

    // Generate session
    const sessionToken = uuidv4();

    await AnalysisSession.create({
        token: sessionToken,
        actions: process.env.ANALYSIS_SESSION_ACTIONS || defaultSessionActions,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.ANALYSIS_SESSION_TOKEN,
        sessionToken,
        {
            sameSite: true,
            httpOnly: true
        }
    );

    res.send(sessionToken);
});

export default router;