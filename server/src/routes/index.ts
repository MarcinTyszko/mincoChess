import { Router } from "express";

import newsArticlesRouter from "./api/newsArticles";
import internalLoginRouter from "./internal/login";
import internalVerifyRouter from "./internal/verifySession";

export const apiRouter = Router();

apiRouter.use("/",
    newsArticlesRouter
);

export const internalRouter = Router();

internalRouter.use("/",
    internalLoginRouter,
    internalVerifyRouter
);