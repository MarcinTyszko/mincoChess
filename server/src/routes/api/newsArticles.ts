import { Router } from "express";
import { connection as database } from "mongoose";

import Collections from "../../lib/database/collections";

const router = Router();

router.get("/api/news", async (req, res) => {
    const articles = await database
        .collection(Collections.NEWS_ARTICLES)
        .find()
        .toArray();

    res.json(articles);
});

export default router;