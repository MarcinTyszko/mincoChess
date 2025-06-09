import { Router } from "express";

import appRouter from "@lib/appRouter";
import featuresRouter from "./features";
import accountRouter from "./account";
import footerRouter from "./footer";

const router = Router();

router.use("/",
    featuresRouter,
    accountRouter,
    footerRouter
);

router.get("/", async (req, res) => {
    res.redirect("/analysis");
});

router.get("/*", appRouter("unfound.html"));

export default router;