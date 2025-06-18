import { Router } from "express";

import publicApiRouter from "./public";

import accountRouter from "./account";

import analysisSessionRouter from "./analysis/session";
import analyseRouter from "./analysis/analyse";

const router = Router();

router.use("/api",
    publicApiRouter,

    accountRouter,
    
    analysisSessionRouter,
    analyseRouter
);

export default router;