import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import Cookie from "shared/constants/Cookie";
import { randomNormalString } from "shared/lib/string";
import Account from "@database/models/account/Account";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { accountCookieOptions } from "@lib/security/account";
import { getGoogleOAuth } from "@lib/security/oauthClient";

const path = "/google";

const router = Router();

const { clientId, clientSecret, client: oauthClient } = getGoogleOAuth();

router.use(path, express.text());

router.post(path, async (req, res) => {
    const authCode: string = req.body;

    if (!oauthClient) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    // Exchange authorization code for tokens
    try {
        var { tokens } = await oauthClient.getToken(authCode);
    } catch {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    if (!tokens.id_token || !tokens.refresh_token || !clientSecret) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    // Create account or update one with refresh token
    const existingAccount = await Account.findOne({ email: googleId.email });

    if (existingAccount) {
        if (existingAccount.id != googleId.sub) {
            return res.sendStatus(StatusCodes.CONFLICT);
        }
    } else while (true) {
        const username = "player_"
            + randomNormalString(8, false).toLowerCase();

        if (await Account.findOne({ username })) continue;

        await Account.insertOne({
            id: googleId.sub,
            email: String(googleId.email),
            displayName: googleId.name,
            username: "player_" + randomNormalString(8, false).toLowerCase(),
            roles: [],
            createdAt: new Date()
        });

        break;
    }

    await SessionToken.insertOne({
        id: googleId.sub,
        type: SessionTokenType.ACCOUNT_REFRESH,
        token: tokens.refresh_token,
        createdAt: new Date()
    });

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