import { Router } from "express";

import appRouter from "@lib/appRouter";

const router = Router();

router.get("/help", appRouter("helpCenter.html"));
router.get("/privacy", appRouter("privacyPolicy.html"));
router.get("/credits", appRouter("credits.html"));

export default router;