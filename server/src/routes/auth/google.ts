import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { Cookie, randomNormalString } from "wintrchess";
import Account from "@database/models/Account";
import { accountCookieOptions } from "@lib/security/account";
import { getGoogleOAuth } from "@lib/security/oauthClient";

const path = "/google";

const router = Router();

const { clientId, clientSecret, client: oauthClient } = getGoogleOAuth();

router.use(path, express.text());

router.post(path, async (req, res) => {
    const authCode: string = req.body;

    if (!oauthClient) {
        return res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
    }

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
        while (true) {
            const username = "player_"
                + randomNormalString(8, false).toLowerCase();

            if (await Account.findOne({ username })) continue;

            await Account.insertOne({
                id: googleId.sub,
                email: String(googleId.email),
                displayName: googleId.name,
                username: "player_" + randomNormalString(8, false).toLowerCase(),
                refreshTokens: [tokens.refresh_token],
                roles: [],
                createdAt: new Date()
            });

            break;
        }
    }

    // Set cookies for tokens
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