import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { Cookie } from "wintrchess";
import AnalysisSession from "@database/models/AnalysisSession";

export const analysisAuthenticator: RequestHandler = async (req, res, next) => {
    // Allow unauthorized requests to be given a session
    if (req.path == "/session") {
        return next();
    }

    // Ensure existence of session token in cookies
    const sessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (!sessionToken) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Verify token against the database
    const session = await AnalysisSession.findOne({ token: sessionToken });

    if (!session) {
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