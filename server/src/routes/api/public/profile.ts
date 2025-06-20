import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { AccountProfile } from "shared/types/AccountProfile";
import Account from "@database/models/account/Account";

const router = Router();

router.get("/profile/:username", async (req, res) => {
    const account = await Account.findOne({
        username: req.params.username
    });

    if (!account) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.json({
        username: account.username,
        displayName: account.displayName,
        roles: account.roles,
        createdAt: account.createdAt.toISOString()
    } as AccountProfile);
});

export default router;