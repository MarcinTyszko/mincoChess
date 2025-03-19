import { Request, Response, NextFunction } from "express";

import { Cookie } from "wintrchess";
import { verifySession } from "./database/session";

async function authenticator(req: Request, res: Response, next: NextFunction) {
    // Allow unauthenticated login page requests
    if (req.path == "/login") {
        return next();
    }

    // Get session token from cookies
    const sessionToken = req.cookies[Cookie.INTERNAL_SESSION_TOKEN];

    // If the user does not have a session token
    if (!sessionToken) {
        return res.redirect("/internal/login");
    }

    // If the token in the cookies is valid
    const tokenValidity = await verifySession(sessionToken);

    if (tokenValidity) {
        next();
    } else {
        res.redirect("/internal/login");
    }
}

export default authenticator;