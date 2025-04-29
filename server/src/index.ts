import express from "express";
import cluster from "cluster";
import os from "os";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDatabase from "@database/connect";
import crossOriginIsolate from "@lib/security/isolate";
import { hostnameWhitelist } from "@lib/security/whitelist";
import { analysisAuthenticator } from "@lib/security/analysis";
import { internalAuthenticator } from "@lib/security/internal";

import { apiRouter, internalRouter } from "./routes";

dotenv.config();

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

function main() {
    const coreCount = os.cpus().length;

    if (cluster.isPrimary) {
        for (let i = 0; i < coreCount; i++) {
            cluster.fork();
        }

        return;
    }

    const app = express();

    app.use(cookieParser());

    // Authentication and security
    app.use(hostnameWhitelist);
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

    app.listen(port, () => {
        if ((cluster.worker?.id || 1) != 1) return;

        console.log(
            `server running on port ${port} `
            + `(${nodeEnv} mode, ${coreCount} thread`
            + (coreCount > 1 ? "s)" : ")")
        );
    });

    connectDatabase();
}

main();