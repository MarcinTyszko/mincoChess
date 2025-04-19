import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectDatabase from "@database/connect";
import crossOriginIsolate from "@lib/isolate";
import { analysisAuthenticator, internalAuthenticator } from "@lib/authentication";

import { apiRouter, internalRouter } from "./routes";

const app = express();

app.use(cookieParser());

// Authentication and security
app.use("/internal", internalAuthenticator);
app.use("/api/analysis", analysisAuthenticator);

app.use("/engines", crossOriginIsolate);

// Static assets
app.use("/",
    express.static("client/dist"),
    express.static("client/public")
);

// Normal endpoints
app.use("/", apiRouter);
app.use("/", internalRouter);

app.get("/internal*", async (req, res) => {
    res.sendFile(
        path.resolve("client/public/apps/internal.html")
    );
});

app.get("/*",
    crossOriginIsolate,
    async (req, res) => {
        res.sendFile(
            path.resolve("client/public/apps/training.html")
        );
    }
);

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

app.listen(port, () => {
    console.log(`server running on port ${port} (${nodeEnv} mode)`);
});

connectDatabase();