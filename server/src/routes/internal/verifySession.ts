import { Router } from "express";

import { Cookie } from "wintrchess";
import { verifySession } from "../../lib/database/session";

const router = Router();

router.get("/internal/verify", async (req, res) => {
    const sessionToken = req.cookies[Cookie.ADMIN_SESSION_TOKEN];
    if (!sessionToken) return res.json(false);

    const tokenValidity = await verifySession(sessionToken);

    res.json(tokenValidity);
});

export default router;