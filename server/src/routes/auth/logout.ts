import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import SessionToken from "@database/models/SessionToken";
import { accountAuthenticator } from "@lib/security/account";

const path = "/logout";

const router = Router();

router.use(path, accountAuthenticator());

router.get(path, async (req, res) => {
    if (!req.accountIdToken) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    await SessionToken.deleteMany({ token: req.accountIdToken });

    res.sendStatus(StatusCodes.OK);
});

export default router;