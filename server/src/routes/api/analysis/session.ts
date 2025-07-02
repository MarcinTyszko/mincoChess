import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { verifySolution } from "altcha-lib";
import { Payload } from "altcha-lib/types";
import { randomBytes } from "crypto";

import Cookie from "shared/constants/Cookie";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { accountCookieOptions } from "@lib/security/account";

const path = "/analysis/session";

const router = Router();

const defaultSessionActions = 80;

router.use(path, express.json());

router.post(path, async (req, res) => {
    const payload: Payload | undefined = req.body;

    // If token missing
    if (!payload) return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("CAPTCHA Payload required.");

    // Verify captcha token
    if (!process.env.ALTCHA_KEY) return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Analysis sessions not available.");

    const captchaSolutionValid = await verifySolution(
        payload, process.env.ALTCHA_KEY
    );

    if (!captchaSolutionValid) return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("CAPTCHA Payload invalid.");

    // Do not replace existing valid session
    const existingSessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (existingSessionToken) {
        const existingSession = await SessionToken.findOne({
            type: SessionTokenType.ANALYSIS,
            token: existingSessionToken
        });

        if (existingSession) {
            return res.sendStatus(StatusCodes.OK);
        }
    }

    // Generate session
    const sessionToken = randomBytes(32).toString("base64");

    await SessionToken.create({
        type: SessionTokenType.ANALYSIS,
        token: sessionToken,
        actions: process.env.ANALYSIS_SESSION_ACTIONS || defaultSessionActions,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.ANALYSIS_SESSION_TOKEN,
        sessionToken,
        accountCookieOptions
    );

    res.send(sessionToken);
});

export default router;