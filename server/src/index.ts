import express from "express";
import cluster from "cluster";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";

import connectDatabase from "@/database/connect";
import hostnameWhitelist from "@/lib/security/whitelist";
import getAuth from "@/lib/auth";
import { serverEnginePool } from "@/lib/serverEngine";
import { coreCount, workerCount } from "@/constants/cluster";
import mainRouter from "./routes";

dotenv.config();

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

async function main() {
    if (cluster.isPrimary) {
        console.log("starting server...");
        for (let i = 0; i < workerCount; i++) cluster.fork();

        let stopping = false;

        // Docker/systemd deliver stop signals to the primary only; without
        // forwarding them, workers (and their Stockfish children) would be
        // left running and reparented — the classic "orphaned engines" leak
        const forwardShutdown = (signal: NodeJS.Signals) => () => {
            stopping = true;

            for (const worker of Object.values(cluster.workers ?? {})) {
                worker?.kill(signal);
            }
        };

        process.once("SIGTERM", forwardShutdown("SIGTERM"));
        process.once("SIGINT", forwardShutdown("SIGINT"));

        // With only a couple of workers, losing one to a crash takes a large
        // slice of the server's capacity with it, so replace it
        cluster.on("exit", worker => {
            if (stopping) return;

            console.error(`worker ${worker.id} died; restarting it`);
            cluster.fork();
        });

        return;
    }

    // Reap this worker's Stockfish processes on shutdown so none are left
    // orphaned when the worker exits or the container is recycled
    const shutdown = () => {
        serverEnginePool.terminateAll();
        process.exit(0);
    };

    process.once("SIGTERM", shutdown);
    process.once("SIGINT", shutdown);

    // A crashing worker is the other way engines get orphaned: without this
    // the process dies while its Stockfish children keep running (and keep
    // their memory) until the container is recycled
    const crash = (err: unknown) => {
        console.error("worker crashed, reaping engines:", err);
        serverEnginePool.killAllNow();
        process.exit(1);
    };

    process.once("uncaughtException", crash);
    process.once("unhandledRejection", crash);

    // Last-resort synchronous kill if the process exits some other way
    process.once("exit", () => serverEnginePool.killAllNow());

    await connectDatabase();

    const app = express();

    app.use(cookieParser());
    app.use(hostnameWhitelist);

    // Static assets
    app.use("/",
        express.static("client/dist"),
        express.static("client/public")
    );

    // Normal endpoints
    app.all("/auth/account/*", toNodeHandler(getAuth()));
    app.use("/", mainRouter);

    // Start listening for requests
    app.listen(port, () => {
        if (cluster.worker?.id != 1) return;

        console.log(
            `server running on port ${port} `
            + `(${nodeEnv} mode, ${workerCount} worker`
            + (workerCount > 1 ? "s" : "")
            + `, ${coreCount} cores)`
        );
    });
}

main();