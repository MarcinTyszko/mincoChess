import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import Cookie from "shared/constants/Cookie";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { accountCookieOptions } from "@lib/security/account";

const path = "/login";

const router = Router();

router.use(path, express.text());

router.post(path, async (req, res) => {
    const password: string = req.body;

    // If parameters are missing
    if (!password) return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Incorrect password.");

    // If password is incorrect
    if (password != process.env.INTERNAL_PASSWORD) return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Incorrect password.");

    // Create session
    const sessionToken = uuidv4();

    await SessionToken.create({
        type: SessionTokenType.INTERNAL,
        token: sessionToken,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.INTERNAL_SESSION_TOKEN,
        sessionToken,
        accountCookieOptions
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;