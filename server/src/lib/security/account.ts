import { RequestHandler, Response, CookieOptions } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { StatusCodes } from "http-status-codes";

import auth from "@lib/auth";

export const accountCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: true,
    secure: true
};

export function reject(res: Response) {
    res.redirect("/signin");
}

/**
 * @description Enforces that the user has a valid account ID / session
 * token, and can optionally redirect to signin page upon rejection. Adds
 * `req.accountId` with the user's account ID, and `req.accountIdToken`
 * with the ID token when authenticated.
 */
export function accountAuthenticator(redirect = false): RequestHandler {
    return async (req, res, next) => {
        const ticket = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!ticket) return redirect
            ? res.redirect("/signin")
            : res.sendStatus(StatusCodes.UNAUTHORIZED);

        req.session = ticket.session;
        req.user = ticket.user;

        next();
    };
}