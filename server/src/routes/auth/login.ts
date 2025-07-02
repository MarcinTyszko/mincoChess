import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { compareSync } from "bcrypt";
import { randomBytes } from "crypto";

import Cookie from "shared/constants/Cookie";
import schemas from "shared/constants/account/schemas";
import Account from "@database/models/account/Account";
import SessionToken from "@database/models/SessionToken";
import SessionTokenType from "@constants/SessionTokenType";
import { accountCookieOptions } from "@lib/security/account";

const path = "/login";

const router = Router();

const loginRequestSchema = z.object({
    email: schemas.email,
    password: schemas.password
});

router.use(path, express.json());

router.post(path, async (req, res) => {
    const login: z.infer<typeof loginRequestSchema> = req.body;

    if (!loginRequestSchema.safeParse(login).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const account = await Account.findOne({ email: login.email });

    if (
        !account?.password
        || !compareSync(login.password, account.password)
    ) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const sessionToken = randomBytes(32).toString("base64");

    await SessionToken.create({
        id: account.id,
        type: SessionTokenType.ACCOUNT,
        token: sessionToken,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.ACCOUNT_ID_TOKEN, sessionToken,
        accountCookieOptions
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;