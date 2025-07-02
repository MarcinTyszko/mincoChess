import express, { Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { randomBytes } from "crypto";

import schemas from "shared/constants/account/schemas";
import Account from "@database/models/account/Account";
import EmailUpdate from "@database/models/account/EmailUpdate";
import { accountAuthenticator } from "@lib/security/account";
import appRouter from "@lib/appRouter";
import { sendAccountEmail } from "@lib/email";

const router = Router();

const emailUpdateSchema = z.object({
    id: z.string(),
    email: schemas.email
});

function reject(res: Response) {
    res.redirect(StatusCodes.UNAUTHORIZED, "/signin");
}

router.use("/email",
    express.json(),
    accountAuthenticator(true)
);

router.get("/email", async (req, res, next) => {
    const updateId = req.query.id?.toString();
    if (!updateId || !req.accountId) return reject(res);

    const update = await EmailUpdate.findOne({ id: updateId });
    if (!update) return reject(res);

    if (update.stage == "current") {
        const updatePageRouter = appRouter("account/emailUpdate.html");
        return updatePageRouter(req, res, next);
    }

    if (!update.email) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await Account.updateOne(
        { id: req.accountId },
        { email: update.email }
    );

    await update.deleteOne();

    res.redirect("/settings/account");
});

router.post("/email", async (req, res) => {
    const updateRequest: z.infer<typeof emailUpdateSchema> = req.body;

    if (!emailUpdateSchema.safeParse(updateRequest).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const update = await EmailUpdate.findOne({ id: updateRequest.id });
    if (update?.stage != "current") return reject(res);

    const refreshedUpdateId = randomBytes(32).toString("base64url");

    update.id = refreshedUpdateId;
    update.stage = "new";
    update.email = updateRequest.email;

    await update.save();

    const verificationUrl = (
        `${process.env.ORIGIN}/auth/update/email?id=${refreshedUpdateId}`
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
});

export default router;