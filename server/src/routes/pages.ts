import { Router } from "express";

import appRouter from "@lib/appRouter";

const router = Router();

router.get("/help", appRouter("helpCenter.html"));

router.get("/analysis", appRouter("analysis.html"));
router.get("/archive", appRouter("archive.html"));
router.get("/news*", appRouter("news.html"));

router.get(/^\/(signin|signup)/, appRouter("signin.html"));
router.get("/settings", appRouter("settings.html"));

router.get("/privacy", appRouter("privacyPolicy.html"));
router.get("/credits", appRouter("credits.html"));

router.get("/internal*", appRouter("internal.html"));

router.get("/", async (req, res) => {
    res.redirect("/analysis");
});

router.get("/*", appRouter("unfound.html"));

export default router;