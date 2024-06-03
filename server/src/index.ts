import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use("/",
    express.static("client/dist"),
    express.static("client/public")
);

app.get("/*", async (req, res) => {
    res.sendFile(path.resolve("client/public/index.html"));
});

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "prod";

app.listen(port, () => {
    console.log(`server running on port ${port} (${nodeEnv} mode)`);
});