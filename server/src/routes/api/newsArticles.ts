import { Router } from "express";

import NewsArticle from "@database/models/NewsArticle";

const router = Router();

const ARTICLES_PER_PAGE = 10;

router.get("/news", async (req, res) => {
    const articleId = req.query.id?.toString();

    const page = Math.max(
        1,
        Number(req.query.page?.toString()) || 1
    );

    if (articleId) {
        const article = await NewsArticle.findOne({ id: articleId });

        res.json(article);
    } else {
        const articles = await NewsArticle.find()
            .sort({ timestamp: "desc" })
            .skip((page - 1) * ARTICLES_PER_PAGE)
            .limit(ARTICLES_PER_PAGE);

        res.json(articles);
    }
});

export default router;