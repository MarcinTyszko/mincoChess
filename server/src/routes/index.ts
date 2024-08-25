import { Router } from "express";

import newsArticlesRouter from "./api/newsArticles";

import loginRouter from "./internal/login";
import deleteNewsArticleRouter from "./internal/news/deleteArticle";
import publishNewsArticleRouter from "./internal/news/publishArticle";

export const apiRouter = Router();

apiRouter.use("/",
    newsArticlesRouter
);

export const internalRouter = Router();

internalRouter.use("/",
    loginRouter,
    deleteNewsArticleRouter,
    publishNewsArticleRouter
);