import express, { Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { compareSync } from "bcrypt";
import { randomBytes } from "crypto";

import { AccountError, Cookie } from "wintrchess";
import Account from "@database/models/account/Account";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";

const path = "/login";

const router = Router();

const loginRequestSchema = z.object({
    email: z.string().email(AccountError.INVALID_EMAIL),
    password: z.string()
        .min(8, AccountError.PASSWORD_TOO_SHORT)
        .max(128, AccountError.PASSWORD_TOO_LONG)
});

function reject(res: Response, reason: AccountError) {
    res.status(StatusCodes.BAD_REQUEST).send(reason);
}

router.use(path, express.json());

router.post(path, async (req, res) => {
    const login: z.infer<typeof loginRequestSchema> = req.body;

    const parseAttempt = loginRequestSchema.safeParse(login);
    const issue = parseAttempt.error?.issues.at(0)?.message;

    if (issue) return reject(res, issue as AccountError);

    const account = await Account.findOne({ email: login.email });

    if (!account?.password) {
        return reject(res, AccountError.ACCOUNT_NOT_FOUND);
    }

    if (!compareSync(login.password, account.password)) {
        return reject(res, AccountError.INCORRECT_PASSWORD);
    }

    const sessionToken = randomBytes(128).toString("base64");

    await SessionToken.insertOne({
        id: account.id,
        type: SessionTokenType.ACCOUNT,
        token: sessionToken,
        createdAt: new Date()
    });

    res.cookie(Cookie.ACCOUNT_ID_TOKEN, sessionToken);

    res.sendStatus(StatusCodes.OK);
});

export default router;