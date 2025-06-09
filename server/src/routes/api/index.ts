import { Router } from "express";

import announcementRouter from "./announcement";
import profileRouter from "./profile";

import newsArticlesRouter from "./news/articles";
import newsArticlesPagesRouter from "./news/pages";

import analysisSessionRouter from "./analysis/session";
import analyseRouter from "./analysis/analyse";

const router = Router();

router.use("/api",
    announcementRouter,
    profileRouter,

    newsArticlesRouter,
    newsArticlesPagesRouter,
    
    analysisSessionRouter,
    analyseRouter
);

export default router;