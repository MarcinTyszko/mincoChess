import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import NewsArticle from "@database/models/NewsArticle";

const router = Router();

const requestSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    thumbnail: z.string(),
    tag: z.object({
        name: z.string(),
        colour: z.string()
    }),
    timestamp: z.number(),
    content: z.string()
});

router.post("/internal/news/publish", async (req, res) => {
    const article: z.infer<typeof requestSchema> = req.body;

    if (!requestSchema.safeParse(article).success) {
        return res.sendStatus(400);
    }

    await NewsArticle.updateOne(
        { id: article.id || uuidv4() },
        { $set: article },
        { upsert: true }
    );    

    res.sendStatus(200);
});

export default router;