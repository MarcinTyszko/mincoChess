import { RequestHandler, Response, CookieOptions } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRefreshClient } from "google-auth-library";

import { Cookie } from "wintrchess";
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

    const refreshToken: string | undefined = req.cookies[
        Cookie.ACCOUNT_REFRESH_TOKEN
    ];

    if (!idToken) return reject(res, StatusCodes.UNAUTHORIZED);

    if (!clientId || !clientSecret) {
        return reject(res, StatusCodes.SERVICE_UNAVAILABLE);
    }

    try {
        await oauthClient.verifyIdToken({
            idToken, audience: clientId
        });
    } catch {
        if (!refreshToken) {
            return reject(res, StatusCodes.UNAUTHORIZED);
        }

        const refreshedIdToken = await attemptTokenRefresh(refreshToken);

        if (refreshedIdToken) {
            res.cookie(
                Cookie.ACCOUNT_ID_TOKEN, refreshedIdToken,
                accountCookieOptions
            );
        } else {
            return reject(res, StatusCodes.UNAUTHORIZED);
        }
    }

    next();
};