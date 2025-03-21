import { Router } from "express";

import NewsArticle from "@database/models/NewsArticle";

const router = Router();

const ARTICLES_PER_PAGE = 10;

router.get("/api/news/pages", async (req, res) => {
    const pageCount = Math.ceil(
        await NewsArticle.countDocuments()
        / ARTICLES_PER_PAGE
    );

    res.json(pageCount);
});

export default router;