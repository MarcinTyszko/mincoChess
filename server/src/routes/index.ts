import { Router } from "express";

import newsArticlesRouter from "./api/newsArticles";
import announcementRouter from "./api/announcement";

import loginRouter from "./internal/login";
import deleteNewsArticleRouter from "./internal/news/deleteArticle";
import publishNewsArticleRouter from "./internal/news/publishArticle";
import publishAnnouncementRouter from "./internal/publishAnnouncement";

export const apiRouter = Router();

apiRouter.use("/",
    newsArticlesRouter,
    announcementRouter
);

export const internalRouter = Router();

internalRouter.use("/",
    loginRouter,
    deleteNewsArticleRouter,
    publishNewsArticleRouter,
    publishAnnouncementRouter
);