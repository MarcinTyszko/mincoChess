import { Router } from "express";

import announcementRouter from "./announcement";
import captchaRouter from "./captcha";
import newsArticlesRouter from "./newsArticles";
import newsArticlesPagesRouter from "./newsArticlesPages";

import analysisSessionRouter from "./analysis/session";
import analyseRouter from "./analysis/analyse";

const router = Router();

router.use("/api",
    announcementRouter,
    captchaRouter,
    newsArticlesRouter,
    newsArticlesPagesRouter,
    analysisSessionRouter,
    analyseRouter
);

export default router;