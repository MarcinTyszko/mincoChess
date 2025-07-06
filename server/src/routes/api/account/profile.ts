import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { AuthenticatedAccountProfile } from "shared/types/AccountProfile";
import Account from "@database/models/account/Account";
import { accountAuthenticator } from "@lib/security/account";

const path = "/profile";

const router = Router();

router.use(path, accountAuthenticator());

router.get(path, async (req, res) => {
    if (!req.accountId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const account = await Account.findOne({ id: req.accountId });

    if (!account) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.json({
        loginMethod: account.password ? "email" : "google",
        email: account.email,
        displayName: account.displayName,
        username: account.username,
        roles: account.roles,
        createdAt: account.createdAt.toISOString()
    } as AuthenticatedAccountProfile);
});

export default router;