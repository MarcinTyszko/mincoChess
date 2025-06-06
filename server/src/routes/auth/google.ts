import express, { CookieOptions, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { random, times } from "lodash";
import { OAuth2Client } from "google-auth-library";

import { Cookie } from "wintrchess";
import Account from "@database/models/Account";

const router = Router();

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const oauthClient = new OAuth2Client(
    clientId, clientSecret, "postmessage"
);

router.use(express.text());

router.post("/auth/google", async (req, res) => {
    const authCode: string = req.body;

    // Exchange authorization code for tokens
    try {
        var { tokens } = await oauthClient.getToken(authCode);
    } catch {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    if (!tokens.id_token || !tokens.refresh_token || !clientSecret) {
        return res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
    }

    // Verify and decode ID token JWT
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: clientId
        });

        var googleId = ticket.getPayload();
    } catch {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    if (!googleId?.sub || !googleId.email) {
        return res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
    }

    // Create account or update one with refresh token
    const existingAccount = await Account.findOne({ id: googleId.sub });

    if (existingAccount) {
        await existingAccount.updateOne({
            refreshTokens: [
                ...existingAccount.refreshTokens,
                tokens.refresh_token
            ].slice(-5)
        });
    } else {
        const username = googleId.name || ("User_"
            + times(6, () => random(1, 9)).join("")
        );

        await Account.insertOne({
            id: googleId.sub,
            email: String(googleId.email),
            username: username,
            refreshTokens: [tokens.refresh_token],
            roles: []
        });
    }

    // Set cookies for tokens
    const accountCookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: true,
        secure: true
    };

    res.cookie(
        Cookie.ACCOUNT_ID_TOKEN,
        tokens.id_token,
        accountCookieOptions
    );

    res.cookie(
        Cookie.ACCOUNT_REFRESH_TOKEN,
        tokens.refresh_token,
        accountCookieOptions
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;