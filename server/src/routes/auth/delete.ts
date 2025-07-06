import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import Account from "@database/models/account/Account";
import SessionToken from "@database/models/SessionToken";
import EmailUpdate from "@database/models/account/EmailUpdate";
import PasswordReset from "@database/models/account/PasswordReset";
import { accountAuthenticator } from "@lib/security/account";

const router = Router();

router.use("/delete", accountAuthenticator());

router.get("/delete", async (req, res) => {
    if (!req.accountId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    await Account.deleteOne({ id: req.accountId });
    await SessionToken.deleteMany({ id: req.accountId });

    await EmailUpdate.deleteMany({ accountId: req.accountId });
    await PasswordReset.deleteMany({ accountId: req.accountId });

    res.sendStatus(StatusCodes.OK);
});

export default router;