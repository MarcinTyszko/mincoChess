import { Router } from "express";

import newsArticlesRouter from "./api/newsArticles";

import loginRouter from "./internal/login";
import deleteNewsArticleRouter from "./internal/news/deleteArticle";

export const apiRouter = Router();

apiRouter.use("/",
    newsArticlesRouter
);

export const internalRouter = Router();

internalRouter.use("/",
    loginRouter,
    deleteNewsArticleRouter
);