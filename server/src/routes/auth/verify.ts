import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

import Cookie from "shared/constants/Cookie";
import AccountVerification from "@database/models/account/AccountVerification";
import Account from "@database/models/account/Account";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { accountCookieOptions } from "@lib/security/account";

const router = Router();

router.get("/verify", async (req, res) => {
    const verificationId = req.query.id?.toString();

    if (!verificationId) {
        return res.status(StatusCodes.BAD_REQUEST).redirect("/signin");
    }

    const verification = await AccountVerification
        .findOne({ id: verificationId });

    if (!verification) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect("/signin");
    }

    await verification.deleteOne();

    const accountId = uuidv4();
    const sessionToken = randomBytes(128).toString("base64");

    await Account.create({
        id: accountId,
        email: verification.email,
        displayName: verification.username,
        username: verification.username,
        password: verification.password,
        roles: [],
        createdAt: new Date()
    });

    await SessionToken.create({
        id: accountId,
        type: SessionTokenType.ACCOUNT,
        token: sessionToken,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.ACCOUNT_ID_TOKEN, sessionToken,
        accountCookieOptions
    );

    res.redirect("/analysis");
});

export default router;