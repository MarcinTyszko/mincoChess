import { Router } from "express";
import { connection as database } from "mongoose";

import Collections from "../../constants/collection";

const router = Router();

const ARTICLES_PER_PAGE = 10;

router.get("/api/news/pages", async (req, res) => {
    const pageCount = Math.ceil(
        await database
            .collection(Collections.NEWS_ARTICLES)
            .countDocuments()
        / ARTICLES_PER_PAGE
    );

    res.json(pageCount);
});

export default router;