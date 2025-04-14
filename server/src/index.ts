import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectDatabase from "@database/connect";
import { analysisAuthenticator, internalAuthenticator } from "@lib/authentication";

import { apiRouter, internalRouter } from "./routes";

const app = express();

app.use(cookieParser());

app.use("/internal", internalAuthenticator);
app.use("/api/analysis", analysisAuthenticator);

app.use("/",
    express.static("client/dist"),
    express.static("client/public")
);

app.use("/", apiRouter);
app.use("/", internalRouter);

app.get("/internal/*", async (req, res) => {
    res.sendFile(
        path.resolve("client/public/apps/internal.html")
    );
});

app.get("/*", async (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

    res.sendFile(
        path.resolve("client/public/apps/training.html")
    );
});

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

app.listen(port, () => {
    console.log(`server running on port ${port} (${nodeEnv} mode)`);
});

connectDatabase();