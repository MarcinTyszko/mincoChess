import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { randomBytes } from "crypto";

import { fieldSchema } from "shared/constants/account/Field";
import Account from "@database/models/account/Account";
import EmailUpdate from "@database/models/account/EmailUpdate";
import PasswordReset from "@database/models/account/PasswordReset";
import { accountAuthenticator } from "@lib/security/account";
import { generateAccountEmail, sendAutomatedEmail } from "@lib/email";

import updateEmailRouter from "./email";
import resetPasswordRouter from "./password";

const router = Router();

const updateSchema = z.object({
    field: fieldSchema,
    value: z.string().optional()
});

router.use("/update",
    express.json(),
    accountAuthenticator()
);

router.post("/update", async (req, res) => {
    if (
        !process.env.ORIGIN
        || !process.env.EMAIL_ACCOUNT
        || !process.env.AUTOMATED_EMAIL_ADDRESS
        || !process.env.AUTOMATED_EMAIL_KEY
    ) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);

    if (!req.accountId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const update: z.infer<typeof updateSchema> = req.body;

    if (!updateSchema.safeParse(update).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    if (update.field == "displayName" || update.field == "username") {
        if (!update.value) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        await Account.updateOne(
            { id: req.accountId },
            { [update.field]: update.value }
        );

        return res.sendStatus(StatusCodes.OK);
    }

    const account = await Account.findOne({ id: req.accountId });

    if (!account) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const updateId = randomBytes(128).toString("base64url");

    if (update.field == "emailAddress") {
        await EmailUpdate.create({
            id: updateId,
            accountId: req.accountId,
            stage: "current",
            createdAt: new Date()
        });

        const verificationUrl = `/auth/update/email?id=${updateId}`;

        sendAutomatedEmail(
            account.email,
            "Verify your current email address",
            generateAccountEmail({
                subject: "Verify your current email address",
                message: "Please verify your WintrChess account's "
                    + "current email address by clicking the button below:",
                buttonLabel: "Verify Email Address",
                buttonUrl: verificationUrl
            }),
            (
                "Please verify your WintrChess account's email address: "
                + verificationUrl
            )
        );

        return res.sendStatus(StatusCodes.OK);
    }

    if (update.field == "password") {
        await PasswordReset.create({
            id: updateId,
            accountId: req.accountId,
            createdAt: new Date()
        });

        const resetUrl = `/auth/update/password?id=${updateId}`;

        sendAutomatedEmail(
            account.email,
            "Reset your WintrChess password",
            generateAccountEmail({
                subject: "Reset your WintrChess password",
                message: "Please reset your WintrChess account's "
                    + "password by clicking the button below:",
                buttonLabel: "Reset Password",
                buttonUrl: resetUrl
            }),
            (
                "Please use the link to reset your WintrChess "
                + `account's password: ${resetUrl}`
            )
        );

        return res.sendStatus(StatusCodes.OK);
    }

    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
});

export default router;