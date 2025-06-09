import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { createChallenge } from "altcha-lib";

const router = Router();

router.get("/captcha", async (req, res) => {
    if (!process.env.ALTCHA_KEY) {
        return res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
    }

    const challenge = await createChallenge({
        hmacKey: process.env.ALTCHA_KEY,
        maxNumber: 100_000
    });

    res.json(challenge);
});

export default router;