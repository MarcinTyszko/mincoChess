import { Router } from "express";

import loginRouter from "./login";
import publishAnnouncementRouter from "./publishAnnouncement";

import deleteArticleRouter from "./news/deleteArticle";
import publishArticleRouter from "./news/publishArticle";

const router = Router();

router.use("/internal",
    loginRouter,
    publishAnnouncementRouter,
    deleteArticleRouter,
    publishArticleRouter
);

export default router;