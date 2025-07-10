import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { accountAuthenticator } from "@lib/security/account";

const path = "/profile";

const router = Router();

router.use(path, accountAuthenticator());

router.get(path, async (req, res) => {
    if (!req.user) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    res.json(req.user);
});

export default router;