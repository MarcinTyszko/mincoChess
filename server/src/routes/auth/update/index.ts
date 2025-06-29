import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";

import AccountField from "shared/constants/account/Field";
import { accountAuthenticator } from "@lib/security/account";
import updateEmailRouter from "./email";
import resetPasswordRouter from "./password";

const router = Router();

const updateSchema = z.object({
    field: z.nativeEnum(AccountField),
    value: z.string().optional(),
    password: z.string().optional()
});

router.use("/update",
    accountAuthenticator,
    updateEmailRouter,
    resetPasswordRouter
);

router.post("/update", async (req, res) => {
    const update: z.infer<typeof updateSchema> = req.body;

    if (!updateSchema.safeParse(update).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

export default router;