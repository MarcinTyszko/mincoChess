import { Router } from "express";

import pagesRouter from "./pages";

import captchaRouter from "./api/captcha";
import newsArticlesRouter from "./api/newsArticles";
import newsArticlesPagesRouter from "./api/newsArticlesPages";
import announcementRouter from "./api/announcement";
import analysisSessionRouter from "./api/analysis/session";
import analyseRouter from "./api/analysis/analyse";

import googleRouter from "./auth/google";

import { internalAuthenticator } from "@lib/security/internal";
import loginRouter from "./internal/login";
import deleteNewsArticleRouter from "./internal/news/deleteArticle";
import publishNewsArticleRouter from "./internal/news/publishArticle";
import publishAnnouncementRouter from "./internal/publishAnnouncement";

export { default as pagesRouter } from "./pages";

export const apiRouter = Router().use("/",
    captchaRouter,
    newsArticlesRouter,
    newsArticlesPagesRouter,
    announcementRouter,
    analysisSessionRouter,
    analyseRouter
);

export const authRouter = Router().use("/",
    googleRouter
);

export const internalRouter = Router().use("/",
    loginRouter,
    deleteNewsArticleRouter,
    publishNewsArticleRouter,
    publishAnnouncementRouter
);

internalRouter.use("/internal", internalAuthenticator);

export default [
    apiRouter,
    authRouter,
    internalRouter,
    pagesRouter
];