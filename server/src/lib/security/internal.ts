import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { Cookie } from "wintrchess";

const defaultSessionExpiry = 3600;

export function signInternalJWT() {
    if (!process.env.INTERNAL_JWT_SECRET) {
        throw new Error("couldn't find JWT secret in environment variables.");
    }

    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (
            Number(process.env.INTERNAL_JWT_EXPIRY)
            || defaultSessionExpiry
        )
    }, process.env.INTERNAL_JWT_SECRET);
}

export const internalAuthenticator: RequestHandler = async (
    req, res, next
) => {
    // Allow unauthenticated login page requests
    if (req.path == "/login") {
        return next();
    }

    const jsonWebToken = req.cookies[Cookie.INTERNAL_JWT];

    if (!jsonWebToken || !process.env.INTERNAL_JWT_SECRET) {
        return res.redirect("/internal/login");
    }

    // Verify token signature and issue refreshed one
    try {
        jwt.verify(jsonWebToken, process.env.INTERNAL_JWT_SECRET);

        const decodedJWT = jwt.decode(jsonWebToken, { json: true });
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime >= (decodedJWT?.exp || 0)) {
            return res.redirect("/internal/login");
        }

        next();
    } catch {
        res.redirect("/internal/login");
    }
};