import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

import { linkedAccountsSchema } from "shared/types/LinkedAccounts";
import LinkedAccountsModel from "@/database/models/LinkedAccounts";
import { accountAuthenticator } from "@/lib/security/account";

const path = "/linked-accounts";

const router = Router();

router.use(path,
    accountAuthenticator(),
    express.json({ limit: "10kb" })
);

router.get(path, async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const linkedAccounts = await LinkedAccountsModel.findOne({
        userId: new Types.ObjectId(req.user.id)
    }).lean();

    res.json({
        chessCom: linkedAccounts?.chessCom || undefined,
        lichess: linkedAccounts?.lichess || undefined
    });
});

router.put(path, async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const parse = linkedAccountsSchema.safeParse(req.body);

    if (!parse.success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    await LinkedAccountsModel.updateOne(
        { userId: new Types.ObjectId(req.user.id) },
        {
            $set: {
                chessCom: parse.data.chessCom || "",
                lichess: parse.data.lichess || ""
            }
        },
        { upsert: true }
    );

    res.json(parse.data);
});

export default router;
