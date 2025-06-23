import { Router } from "express";

import Account from "@database/models/account/Account";
import appRouter from "@lib/appRouter";

const router = Router();

router.get(/^\/(signin|signup)/, appRouter("signin.html"));

router.get("/settings*", appRouter("settings.html"));

router.get("/profile/:username", async (req, res, next) => {
    const account = await Account.findOne({
        username: req.params.username
    });

    if (!account) {
        const unfoundRouter = appRouter("unfound.html");
        return unfoundRouter(req, res, next);
    }

    const profileRouter = appRouter(
        "profile.html", async req => req.params
    );

    profileRouter(req, res, next);
});

export default router;