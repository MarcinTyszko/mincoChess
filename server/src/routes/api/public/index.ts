import { Router } from "express";

import announcementRouter from "./announcement";
import profileRouter from "./profile";

import newsArticlesRouter from "./news/articles";
import newsPagesRouter from "./news/pages";

const router = Router();

router.use("/public",
    announcementRouter,
    profileRouter,

    newsArticlesRouter,
    newsPagesRouter
);

export default router;