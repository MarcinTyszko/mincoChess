import { Router } from "express";

import appRouter from "@/lib/appRouter";

const router = Router();

router.get("/help", appRouter("footer/helpCenter.html"));
router.get("/privacy", appRouter("footer/privacyPolicy.html"));

export default router;