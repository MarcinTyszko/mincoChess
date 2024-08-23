import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectDatabase from "./lib/database";
import authenticator from "./lib/auth";
import * as Routes from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/internal", authenticator);

app.use("/",
    express.static("client/dist"),
    express.static("client/public")
);

app.use("/", Routes.internalRouter);
app.use("/", Routes.apiRouter);

app.get("/*", async (req, res) => {
    res.sendFile(
        path.resolve("client/public/index.html")
    );
});

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

app.listen(port, () => {
    console.log(`server running on port ${port} (${nodeEnv} mode)`);
});

connectDatabase();