import { Router } from "express";
import { z } from "zod";
import { connection as database } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { NewsArticle } from "wintrchess";
import Collections from "../../../lib/database/collections";

const router = Router();

const requestSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    tag: z.object({
        name: z.string(),
        colour: z.string()
    }),
    date: z.string().datetime(),
    content: z.string()
});

router.post("/internal/news/publish", async (req, res) => {
    const article: z.infer<typeof requestSchema> = req.body;

    if (!requestSchema.safeParse(article).success) {
        return res.sendStatus(400);
    }

    if (article.id) {
        // If an article ID is specified, edit the article
        await database
            .collection<NewsArticle>(Collections.NEWS_ARTICLES)
            .updateOne(
                { id: article.id },
                { $set: article }
            );
    } else {
        // If no ID specified, publish a new article
        await database
            .collection<NewsArticle>(Collections.NEWS_ARTICLES)
            .insertOne({
                id: uuidv4(),
                ...article
            });
    }

    res.sendStatus(200);
});

export default router;