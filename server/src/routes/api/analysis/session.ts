import { Router } from "express";

import { Cookie } from "wintrchess";
import { verifyCaptchaToken } from "../../../lib/captcha";
import { createSession } from "../../../lib/database/session";
import SessionType from "../../../constants/sessionType";

const router = Router();

interface SessionRequest {
    token?: string;
}

router.post("/api/analysis/session", async (req, res) => {
    const { token }: SessionRequest = req.body;

    if (!token) {
        return res.status(400).send("CAPTCHA Token required.");
    }

    const captchaTokenValid = await verifyCaptchaToken(
        token,
        process.env.TURNSTILE_ANALYSIS_SECRET_KEY
    );

    if (!captchaTokenValid) {
        return res.status(400).send("CAPTCHA Token invalid.");
    }

    res.cookie(
        Cookie.ANALYSIS_SESSION_TOKEN,
        await createSession(
            SessionType.ANALYSIS,
            {
                remainingActions: 80
            }
        ),
        {
            sameSite: true,
            httpOnly: true
        }
    );

    res.sendStatus(200);
});

export default router;