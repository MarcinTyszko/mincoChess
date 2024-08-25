import { Router } from "express";
import { connection as database } from "mongoose";

import Collections from "../../lib/database/collections";
import { NewsArticle } from "wintrchess";

const router = Router();

router.get("/api/news", async (req, res) => {
    const articleId = req.query.id;

    if (articleId) {
        const article = await database
            .collection<NewsArticle>(Collections.NEWS_ARTICLES)
            .findOne({ id: articleId });

        res.json(article);
    } else {
        const articles = await database
            .collection<NewsArticle>(Collections.NEWS_ARTICLES)
            .find()
            .toArray();

        res.json(articles);
    }
});

export default router;