import { RequestHandler, Router } from "express";
import path from "path";

function appRouter(filename: string): RequestHandler {
    return async (req, res) => res.sendFile(
        path.resolve(`client/public/apps/${filename}`)
    );
}

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