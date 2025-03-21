import { Router } from "express";
import { connection as database } from "mongoose";

import Collection from "@constants/Collection";

const router = Router();

const ARTICLES_PER_PAGE = 10;

router.get("/api/news/pages", async (req, res) => {
    const pageCount = Math.ceil(
        await database
            .collection(Collection.NEWS_ARTICLES)
            .countDocuments()
        / ARTICLES_PER_PAGE
    );

    res.json(pageCount);
});

export default router;