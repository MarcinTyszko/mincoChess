import { RequestHandler, Response, CookieOptions } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRefreshClient } from "google-auth-library";
import jwt from "jsonwebtoken";

import Cookie from "shared/constants/Cookie";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { getGoogleOAuth } from "./oauthClient";

const { clientId, clientSecret, client: oauthClient } = getGoogleOAuth();

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

/**
 * @description Enforces that the user has a valid account ID / session
 * token, and can optionally redirect to signin page upon rejection. Adds
 * `req.accountId` with the user's account ID when authenticated. The ID
 * token is recorded in `req.accountIdToken` regardless of authentication.
 */
export function accountAuthenticator(redirect = false): RequestHandler {
    function reject(res: Response, reason: StatusCodes) {
        if (redirect) {
            return res.status(reason).redirect("/signin");
        }
        
        res.sendStatus(reason);
    }

    return async (req, res, next) => {
        const idToken: string | undefined = req.cookies[
            Cookie.ACCOUNT_ID_TOKEN
        ];

        if (!idToken) {
            return reject(res, StatusCodes.UNAUTHORIZED);
        }

        req.accountIdToken = idToken;

        // Permit existing account token
        const accountToken = await SessionToken.findOne({
            type: SessionTokenType.ACCOUNT,
            token: idToken
        });

        if (accountToken) {
            req.accountId = accountToken.id;
            return next();
        }

        // Verify and refresh Google ID token
        const refreshToken: string | undefined = req.cookies[
            Cookie.ACCOUNT_REFRESH_TOKEN
        ];

        if (!clientId || !clientSecret) {
            return reject(res, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const validIdToken = await SessionToken.findOne({
            type: SessionTokenType.ACCOUNT_GOOGLE,
            token: idToken
        });

        if (!validIdToken) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        try {
            const ticket = await oauthClient.verifyIdToken({
                idToken, audience: clientId
            });

            req.accountId = ticket.getPayload()?.sub;
        } catch {
            if (!refreshToken) {
                return reject(res, StatusCodes.UNAUTHORIZED);
            }

            const refreshedIdToken = await attemptTokenRefresh(refreshToken);

            if (!refreshedIdToken) {
                await SessionToken.deleteOne({ token: idToken });
                
                return reject(res, StatusCodes.UNAUTHORIZED);
            }

            await SessionToken.updateOne({ token: idToken }, {
                token: refreshedIdToken,
                createdAt: new Date()
            });

            req.accountId = jwt.decode(refreshedIdToken, { json: true })?.sub;

            res.cookie(
                Cookie.ACCOUNT_ID_TOKEN, refreshedIdToken,
                accountCookieOptions
            );
        }

        next();
    };
}