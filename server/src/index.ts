import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import internalLoginRouter from "./routes/internal/login";
import internalVerifySessionRouter from "./routes/internal/verifySession";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/",
    express.static("client/dist"),
    express.static("client/public")
);

app.use("/", internalLoginRouter);
app.use("/", internalVerifySessionRouter);

app.get("/*", async (req, res) => {
    res.sendFile(path.resolve("client/public/index.html"));
});

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "prod";

app.listen(port, () => {
    console.log(`server running on port ${port} (${nodeEnv} mode)`);
});