import express, { Router, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { randomBytes } from "crypto";
import { hashSync } from "bcrypt";

import AccountError from "shared/constants/account/Error";
import schemas from "shared/constants/account/schemas";
import Account from "@database/models/account/Account";
import AccountVerification from "@database/models/account/AccountVerification";
import { sendAccountEmail } from "@lib/email";

const path = "/register";

const router = Router();

const registerRequestSchema = z.object({
    email: schemas.email,
    username: schemas.username,
    password: schemas.password,
    confirmedPassword: schemas.password
}).refine(
    schema => schema.confirmedPassword == schema.password,
    AccountError.PASSWORD_NO_MATCH
);

function reject(res: Response, reason: AccountError) {
    res.status(StatusCodes.BAD_REQUEST).send(reason);
}

router.use(path, express.json());

router.post(path, async (req, res) => {
    if (!process.env.ORIGIN) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const registration: z.infer<typeof registerRequestSchema> = req.body;

    const parseAttempt = registerRequestSchema.safeParse(registration);
    const issue = parseAttempt.error?.issues.at(0)?.message;

    if (issue) return reject(res, issue as AccountError);

    // Ensure no existing account
    const existingAccount = await Account.findOne({
        $or: [
            { email: registration.email },
            { username: registration.username }
        ]
    });

    if (existingAccount) {
        return reject(res, AccountError.ACCOUNT_ALREADY_EXISTS);
    }

    // Check for verification cooldown
    const existingVerification = await AccountVerification.findOne({
        email: registration.email,
        createdAt: {
            $gte: new Date(Date.now() - 60000)
        }
    });

    if (existingVerification) {
        return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS);
    }

    // Create verification and send email
    const verificationId = randomBytes(32).toString("base64url");

    await AccountVerification.create({
        id: verificationId,
        email: registration.email,
        username: registration.username,
        password: hashSync(registration.password, 10),
        createdAt: new Date()
    });

    const verificationUrl = (
        `${process.env.ORIGIN}/auth/verify?id=${verificationId}`
    );

    try {
        sendAccountEmail({
            recipient: registration.email,
            subject: "Verify your WintrChess account",
            message: "Thank you for creating an account on WintrChess! "
                + "Please verify your account by clicking the button below:",
            buttonLabel: "Verify Account",
            buttonUrl: verificationUrl,
            plaintextFallback: (
                `Please verify your WintrChess account: ${verificationUrl}`
            )
        });
    } catch {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.sendStatus(StatusCodes.OK);
});

export default router;