import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { randomBytes } from "crypto";

import { fieldSchema } from "shared/constants/account/Field";
import Account from "@database/models/account/Account";
import EmailUpdate from "@database/models/account/EmailUpdate";
import PasswordReset from "@database/models/account/PasswordReset";
import { accountAuthenticator } from "@lib/security/account";
import { sendAccountEmail } from "@lib/email";

import updateEmailRouter from "./email";
import resetPasswordRouter from "./password";

const router = Router();

const updateSchema = z.object({
    field: fieldSchema,
    value: z.string().optional()
});

router.use("/update",
    updateEmailRouter,
    resetPasswordRouter,
    express.json(),
    accountAuthenticator()
);

router.post("/update", async (req, res) => {
    if (!process.env.ORIGIN) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

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

    const updateId = randomBytes(32).toString("base64url");

    if (update.field == "emailAddress") {
        await EmailUpdate.create({
            id: updateId,
            accountId: req.accountId,
            stage: "current",
            createdAt: new Date()
        });

        const verificationUrl = (
            `${process.env.ORIGIN}/auth/update/email?id=${updateId}`
        );

        try {
            sendAccountEmail({
                recipient: account.email,
                subject: "Verify your current email address",
                message: "Please verify your WintrChess account's current"
                    + " email address by clicking the button below:",
                buttonLabel: "Verify Email Address",
                buttonUrl: verificationUrl,
                plaintextFallback: "Please verify your WintrChess account's"
                    + ` email address: ${verificationUrl}`
            });
        } catch {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.sendStatus(StatusCodes.OK);
    }

    if (update.field == "password") {
        await PasswordReset.create({
            id: updateId,
            accountId: req.accountId,
            createdAt: new Date()
        });

        const resetUrl = (
            `${process.env.ORIGIN}/auth/update/password?id=${updateId}`
        );

        try {
            sendAccountEmail({
                recipient: account.email,
                subject: "Reset your WintrChess password",
                message: "Please reset your WintrChess account's "
                    + "password by clicking the button below:",
                buttonLabel: "Reset Password",
                buttonUrl: resetUrl,
                plaintextFallback: "Please use the link to reset your"
                    + ` WintrChess account's password: ${resetUrl}`
            });
        } catch {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.sendStatus(StatusCodes.OK);
    }

    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
});

export default router;