import { RequestHandler, Response, CookieOptions } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRefreshClient } from "google-auth-library";

import { Cookie } from "wintrchess";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { getGoogleOAuth } from "./oauthClient";

const { clientId, clientSecret, client: oauthClient } = getGoogleOAuth();

function reject(res: Response, reason: StatusCodes) {
    res.status(reason).redirect("/signin");
}

async function attemptTokenRefresh(refreshToken: string) {
    const refreshClient = new UserRefreshClient(
        clientId, clientSecret, refreshToken
    );

    try {
        const { credentials } = await refreshClient.refreshAccessToken();

        return credentials.id_token ?? undefined;
    } catch {
        return undefined;
    }
}

export const accountCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: true,
    secure: true
};

export const accountAuthenticator: RequestHandler = async (req, res, next) => {
    const idToken: string | undefined = req.cookies[
        Cookie.ACCOUNT_ID_TOKEN
    ];

    if (!idToken) {
        return reject(res, StatusCodes.UNAUTHORIZED);
    }

    // Permit existing account token
    const accountToken = await SessionToken.findOne({
        type: SessionTokenType.ACCOUNT,
        token: idToken
    });

    if (accountToken) return next();

    // Verify and refresh Google ID token
    const refreshToken: string | undefined = req.cookies[
        Cookie.ACCOUNT_REFRESH_TOKEN
    ];

    if (!clientId || !clientSecret) {
        return reject(res, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    try {
        await oauthClient.verifyIdToken({
            idToken, audience: clientId
        });
    } catch {
        if (!refreshToken) {
            return reject(res, StatusCodes.UNAUTHORIZED);
        }

        const validRefreshToken = await SessionToken.findOne({
            type: SessionTokenType.ACCOUNT_REFRESH,
            token: refreshToken
        });

        if (!validRefreshToken) {
            return reject(res, StatusCodes.UNAUTHORIZED);
        }

        const refreshedIdToken = await attemptTokenRefresh(refreshToken);

        if (refreshedIdToken) {
            res.cookie(
                Cookie.ACCOUNT_ID_TOKEN, refreshedIdToken,
                accountCookieOptions
            );
        } else {
            validRefreshToken.deleteOne();
            reject(res, StatusCodes.UNAUTHORIZED);

            return;
        }
    }

    next();
};