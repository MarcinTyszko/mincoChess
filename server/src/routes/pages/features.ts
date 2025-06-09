import { Router } from "express";

import appRouter from "@lib/appRouter";

const router = Router();

router.get("/analysis", appRouter("analysis.html"));
router.get("/archive", appRouter("archive.html"));

router.get("/news*", appRouter("news.html"));

export default router;