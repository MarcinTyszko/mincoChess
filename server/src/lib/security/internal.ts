import { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Cookie } from "wintrchess";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";

function reject(res: Response) {
    res.status(StatusCodes.UNAUTHORIZED).redirect("/internal/login");
}

export const internalAuthenticator: RequestHandler = async (
    req, res, next
) => {
    if (req.originalUrl.startsWith("/internal/login")) {
        return next();
    }

    const internalToken = req.cookies[Cookie.INTERNAL_SESSION_TOKEN];

    if (!internalToken) {
        return reject(res);
    }

    const validInternalToken = await SessionToken.findOne({
        type: SessionTokenType.INTERNAL,
        token: internalToken
    });

    if (!validInternalToken) {
        return reject(res);
    }

    next();
};