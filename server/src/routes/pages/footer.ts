import { Router } from "express";

import appRouter from "@/lib/appRouter";

const router = Router();

router.get("/help", appRouter("footer/helpCenter.html"));
router.get("/privacy", appRouter("footer/privacyPolicy.html"));
router.get("/credits", appRouter("footer/credits.html"));

export default router;