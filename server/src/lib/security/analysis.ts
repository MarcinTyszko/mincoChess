import { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { StatusCodes } from "http-status-codes";

import Cookie from "shared/constants/Cookie";
import AnalysisSession from "@/database/models/AnalysisSession";
import getAuth from "@/lib/auth";

const analysisAuthenticator: RequestHandler = async (req, res, next) => {
    // Signed-in accounts are trusted without a CAPTCHA-backed session;
    // this also lets auto-analysis of recent games run unattended
    try {
        const ticket = await getAuth().api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (ticket) {
            req.session = ticket.session;
            req.user = ticket.user;

            return next();
        }
    } catch {
        // Fall through to the analysis session check
    }

    // Ensure existence of session token in cookies
    const sessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (!sessionToken) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Verify token against the database
    const session = await AnalysisSession.findOne({ token: sessionToken });

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

export default analysisAuthenticator;