import { Router } from "express";
import { connection as database } from "mongoose";

import { NewsArticle } from "wintrchess";
import Collections from "../../constants/collection";

const router = Router();

const ARTICLES_PER_PAGE = 10;

router.get("/api/news", async (req, res) => {
    const articleId = req.query.id?.toString();

    const page = Math.max(
        1,
        parseInt(req.query.page?.toString() || "1") || 1
    );

    if (articleId) {
        const article = await database
            .collection<NewsArticle>(Collections.NEWS_ARTICLES)
            .findOne({ id: articleId });

        res.json(article);
    } else {
        const articles = await database
            .collection<NewsArticle>(Collections.NEWS_ARTICLES)
            .find()
            .sort({ timestamp: -1 })
            .skip((page - 1) * ARTICLES_PER_PAGE)
            .limit(ARTICLES_PER_PAGE)
            .toArray();

        res.json(articles);
    }
});

export default router;