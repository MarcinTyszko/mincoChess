import { Router } from "express";

import appRouter from "@lib/appRouter";

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

router.use("/internal*", appRouter("internal.html"));

export default router;