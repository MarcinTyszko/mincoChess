import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { createHash, randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

import { Cookie } from "wintrchess";
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

    const hashedId = createHash("sha-256")
        .update(verificationId)
        .digest("hex");

    const verification = await AccountVerification.findOne({ id: hashedId });

    if (!verification) {
        return res.status(StatusCodes.UNAUTHORIZED).redirect("/signin");
    }

    await verification.deleteOne();

    const accountId = uuidv4();
    const sessionToken = randomBytes(128).toString("base64");

    await Account.insertOne({
        id: accountId,
        email: verification.email,
        displayName: verification.username,
        username: verification.username,
        password: verification.password,
        roles: [],
        createdAt: new Date()
    });

    await SessionToken.insertOne({
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