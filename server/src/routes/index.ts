import { Router } from "express";

import captchaRouter from "./api/captcha";
import newsArticlesRouter from "./api/newsArticles";
import newsArticlesPagesRouter from "./api/newsArticlesPages";
import announcementRouter from "./api/announcement";
import analysisSessionRouter from "./api/analysis/session";
import classifyRouter from "./api/analysis/classify";

import loginRouter from "./internal/login";
import deleteNewsArticleRouter from "./internal/news/deleteArticle";
import publishNewsArticleRouter from "./internal/news/publishArticle";
import publishAnnouncementRouter from "./internal/publishAnnouncement";

export { default as pagesRouter } from "./pages";

export const apiRouter = Router()
    .use("/",
        captchaRouter,
        newsArticlesRouter,
        newsArticlesPagesRouter,
        announcementRouter,
        analysisSessionRouter,
        classifyRouter
    );

export const internalRouter = Router()
    .use("/",
        loginRouter,
        deleteNewsArticleRouter,
        publishNewsArticleRouter,
        publishAnnouncementRouter
    );