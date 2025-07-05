import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { randomBytes } from "crypto";

import schemas from "shared/constants/account/schemas";
import Account from "@database/models/account/Account";
import SessionToken from "@database/models/SessionToken";
import EmailUpdate from "@database/models/account/EmailUpdate";
import { accountAuthenticator, reject } from "@lib/security/account";
import appRouter from "@lib/appRouter";
import { sendAccountEmail } from "@lib/email";

const router = Router();

const emailUpdateSchema = z.object({
    id: z.string(),
    email: schemas.email
});

router.use("/email", express.json());

router.get("/email", async (req, res, next) => {
    const updateId = req.query.id?.toString();
    if (!updateId) return reject(res);

    const update = await EmailUpdate.findOne({
        $or: [
            { currentId: updateId },
            { newId: updateId }
        ]
    });
    if (!update) return reject(res);

    if (updateId == update.currentId) {
        const updatePageRouter = appRouter("account/update.html");
        return updatePageRouter(req, res, next);
    }

    if (!update.email) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await update.deleteOne();

    await Account.updateOne(
        { id: update.accountId },
        { email: update.email }
    );

    await SessionToken.deleteMany({
        id: update.accountId,
        token: { $ne: req.accountIdToken }
    });

    res.redirect("/settings/account");
});

router.post("/email",
    accountAuthenticator(),
    async (req, res) => {
        if (!req.accountId) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const updateRequest: z.infer<typeof emailUpdateSchema> = req.body;

        if (!emailUpdateSchema.safeParse(updateRequest).success) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        const update = await EmailUpdate.findOne({
            accountId: req.accountId,
            currentId: updateRequest.id
        });

        if (!update || update.accountId != req.accountId) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        if (
            update.newCreatedAt
            && update.newCreatedAt.getTime() >= (Date.now() - 60000)
        ) return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS);

        const newId = randomBytes(32).toString("base64url");

        update.newId = newId;
        update.email = updateRequest.email;
        update.newCreatedAt = new Date();

        await update.save();

        const verificationUrl = (
            `${process.env.ORIGIN}/auth/update/email?id=${newId}`
        );

        try {
            sendAccountEmail({
                recipient: updateRequest.email,
                subject: "Verify your new email address",
                message: "Please verify your WintrChess account's new"
                    + " email address by clicking the button below:",
                buttonLabel: "Verify Email Address",
                buttonUrl: verificationUrl,
                plaintextFallback: "Please verify your WintrChess account's"
                    + ` new email address: ${verificationUrl}`
            });
        } catch {
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }

        res.sendStatus(StatusCodes.OK);
    }
);

export default router;