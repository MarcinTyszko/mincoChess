import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { Cookie } from "wintrchess";
import AnalysisSession from "@database/models/AnalysisSession";

const defaultSessionExpiry = 300;

export function signInternalJWT() {
    if (!process.env.INTERNAL_JWT_SECRET) {
        throw new Error("couldn't find JWT secret in environment variables.");
    }

    return jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000)
                + (
                    Number(process.env.INTERNAL_JWT_EXPIRY)
                    || defaultSessionExpiry
                )
        },
        process.env.INTERNAL_JWT_SECRET
    );
}

export const internalAuthenticator: RequestHandler = async (req, res, next) => {
    // Allow unauthenticated login page requests
    if (req.path == "/login") {
        return next();
    }

    const jsonWebToken = req.cookies[Cookie.INTERNAL_JWT];

    if (!jsonWebToken || !process.env.INTERNAL_JWT_SECRET) {
        return res.redirect("/internal/login");
    }

    // Verify token signature and refresh it
    try {
        jwt.verify(jsonWebToken, process.env.INTERNAL_JWT_SECRET);

        res.cookie(
            Cookie.INTERNAL_JWT,
            signInternalJWT()
        );

        next();
    } catch {
        res.redirect("/internal/login");
    }
};

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

    if (session) {
        next();
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
};