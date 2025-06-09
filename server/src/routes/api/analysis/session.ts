import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { verifySolution } from "altcha-lib";
import { Payload } from "altcha-lib/types";

import { Cookie } from "wintrchess";
import AnalysisSession from "@database/models/AnalysisSession";

const path = "/analysis/session";

const router = Router();

const defaultSessionActions = 80;

router.use(path, express.json());

router.post(path, async (req, res) => {
    const payload: Payload | undefined = req.body;

    // If token missing
    if (!payload) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("CAPTCHA Payload required.");
    }

    // Verify captcha token
    if (!process.env.ALTCHA_KEY) {
        return res
            .status(StatusCodes.SERVICE_UNAVAILABLE)
            .send("Analysis sessions not available.");
    }

    const captchaSolutionValid = await verifySolution(
        payload,
        process.env.ALTCHA_KEY
    );

    if (!captchaSolutionValid) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("CAPTCHA Payload invalid.");
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