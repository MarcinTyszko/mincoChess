import express, { Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { hashSync } from "bcrypt";

import schemas from "shared/constants/account/schemas";
import PasswordReset from "@database/models/account/PasswordReset";
import appRouter from "@lib/appRouter";
import { accountAuthenticator } from "@lib/security/account";
import Account from "@database/models/account/Account";

const router = Router();

const passwordResetSchema = z.object({
    id: z.string(),
    password: schemas.password,
    confirmPassword: schemas.password
}).refine(schema => (
    schema.password == schema.confirmPassword
));

function reject(res: Response) {
    res.status(StatusCodes.UNAUTHORIZED).redirect("/signin");
}

router.use("/password",
    express.json(),
    accountAuthenticator(true)
);

router.get("/password", async (req, res, next) => {
    const resetId = req.query.id?.toString();
    if (!resetId) return reject(res);

    const reset = await PasswordReset.findOne({ id: resetId });
    if (!reset) return reject(res);

    const passwordResetRouter = appRouter("account/passwordReset.html");
    passwordResetRouter(req, res, next);
});

router.post("/password", async (req, res) => {
    if (!req.accountId) return reject(res);

    const resetRequest: z.infer<typeof passwordResetSchema> = req.body;
    
    if (!passwordResetSchema.safeParse(resetRequest).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const reset = await PasswordReset.findOne({ id: resetRequest.id });
    if (!reset) reject(res);

    await Account.updateOne(
        { id: req.accountId },
        { password: hashSync(resetRequest.password, 10) }
    );

    res.redirect("/settings/account");
});

export default router;