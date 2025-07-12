import { Router } from "express";

import publicApiRouter from "./public";
import accountRouter from "./account";
import analyseRouter from "./analysis/analyse";

const router = Router();

router.use("/api",
    publicApiRouter,
    accountRouter,
    analyseRouter
);

export default router;