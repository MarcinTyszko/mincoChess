import { Router } from "express";
import { connection as database } from "mongoose";

import Collections from "../../../constants/Collection";

const router = Router();

interface DeleteArticleRequest {
    id?: string;
}

router.post("/internal/news/delete", async (req, res) => {
    const { id }: DeleteArticleRequest = req.body;

    if (!id) {
        return res.sendStatus(400);
    }

    await database
        .collection(Collections.NEWS_ARTICLES)
        .deleteOne({ id });

    res.sendStatus(200);
});

export default router;