import { RequestHandler, Router } from "express";
import path from "path";

import crossOriginIsolate from "@lib/security/isolate";

function pageFileRouter(filename: string): RequestHandler {
    return async (req, res) => res.sendFile(
        path.resolve(`client/public/apps/${filename}`)
    );
}

const router = Router();

router.get("/help", pageFileRouter("helpCenter.html"));

router.get("/analysis",
    crossOriginIsolate,
    pageFileRouter("analysis.html")
);
router.get("/archive", pageFileRouter("archive.html"));

router.get("/news*", pageFileRouter("news.html"));
router.get("/settings", pageFileRouter("settings.html"));
router.get("/privacy", pageFileRouter("privacyPolicy.html"));
router.get("/credits", pageFileRouter("credits.html"));

router.get("/internal*", pageFileRouter("internal.html"));

router.get("/", async (req, res) => {
    res.redirect("/analysis");
});

router.get("/*", pageFileRouter("unfound.html"));

export default router;