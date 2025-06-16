import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { Cookie } from "wintrchess";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";

const analysisAuthorizer: RequestHandler = async (req, res, next) => {
    // Ensure existence of session token in cookies
    const sessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (!sessionToken) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Verify token against the database
    const session = await SessionToken.findOne({
        type: SessionTokenType.ANALYSIS,
        token: sessionToken
    });

    if (!session?.actions) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const newActions = session.actions - 1;

    if (newActions > 0) {
        session.actions = newActions;
        await session.save();
    } else {
        await session.deleteOne();
    }

    next();
};

export default analysisAuthorizer;