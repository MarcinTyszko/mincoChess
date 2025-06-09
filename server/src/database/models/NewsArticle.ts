import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

const newsArticleSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    tag: {
        name: { type: String, required: true },
        colour: { type: String, required: true }
    },
    timestamp: { type: Date, required: true },
    content: { type: String, required: true }
});

const NewsArticle = model(
    "NewsArticle",
    newsArticleSchema,
    Collection.NEWS_ARTICLES
);

export default NewsArticle;