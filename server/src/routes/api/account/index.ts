import { Router } from "express";

import profileRouter from "./profile";
import learningRouter from "./learning";
import linkedAccountsRouter from "./linkedAccounts";

const router = Router();

router.use("/account",
    profileRouter,
    learningRouter,
    linkedAccountsRouter
);

export default router;