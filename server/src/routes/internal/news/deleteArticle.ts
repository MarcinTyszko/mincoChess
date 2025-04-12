import { Router } from "express";

import NewsArticle from "@database/models/NewsArticle";

const router = Router();

interface DeleteArticleRequest {
    id?: string;
}

router.post("/internal/news/delete", async (req, res) => {
    const { id }: DeleteArticleRequest = req.body;

    if (!id) {
        return res.sendStatus(400);
    }

    await NewsArticle.deleteOne({ id });

    res.sendStatus(200);
});

export default router;