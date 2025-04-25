import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { Cookie } from "wintrchess";
import { signInternalJWT } from "@lib/authentication";

const path = "/internal/login";

const router = Router();

interface LoginRequest {
    password?: string;
}

router.use(path, express.json());

router.post(path, (req, res) => {
    const { password }: LoginRequest = req.body;

    // If parameters are missing
    if (!password) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Incorrect password.");
    }

    // If password is incorrect, 401
    if (password != process.env.INTERNAL_PASSWORD) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Incorrect password.");
    }

    // Create session
    try {
        res.cookie(
            Cookie.INTERNAL_JWT,
            signInternalJWT(),
            {
                sameSite: true,
                httpOnly: true
            }
        );
    
        res.sendStatus(StatusCodes.OK);
    } catch {
        res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
    }
});

export default router;