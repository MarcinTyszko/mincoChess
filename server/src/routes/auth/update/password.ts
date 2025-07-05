import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { hashSync } from "bcrypt";

import schemas from "shared/constants/account/schemas";
import PasswordReset from "@database/models/account/PasswordReset";
import appRouter from "@lib/appRouter";
import { accountAuthenticator, reject } from "@lib/security/account";
import Account from "@database/models/account/Account";

const router = Router();

const passwordResetSchema = z.object({
    id: z.string(),
    password: schemas.password,
    confirmPassword: schemas.password
}).refine(schema => (
    schema.password == schema.confirmPassword
));

router.use("/password", express.json());

router.get("/password", async (req, res, next) => {
    const resetId = req.query.id?.toString();
    if (!resetId) return reject(res);

    const reset = await PasswordReset.findOne({ id: resetId });
    if (!reset) return reject(res);

    const passwordResetRouter = appRouter("account/update.html");
    passwordResetRouter(req, res, next);
});

router.post("/password",
    accountAuthenticator(true),
    async (req, res) => {
        const resetRequest: z.infer<typeof passwordResetSchema> = req.body;
        
        if (!passwordResetSchema.safeParse(resetRequest).success) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        const reset = await PasswordReset.findOne({ id: resetRequest.id });
        
        if (!reset || req.accountId != reset.accountId) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        await Account.updateOne(
            { id: reset.accountId },
            { password: hashSync(resetRequest.password, 10) }
        );

        res.redirect("/settings/account");
    }
);

export default router;