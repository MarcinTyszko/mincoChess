import { Router } from "express";

import publicApiRouter from "./public";

import analysisSessionRouter from "./analysis/session";
import analyseRouter from "./analysis/analyse";

const router = Router();

router.use("/api",
    publicApiRouter,
    
    analysisSessionRouter,
    analyseRouter
);

export default router;