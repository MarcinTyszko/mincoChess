import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

const newsArticleSchema = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

const NewsArticle = model(
    "NewsArticle",
    newsArticleSchema,
    Collection.NEWS_ARTICLES
);

export default NewsArticle;