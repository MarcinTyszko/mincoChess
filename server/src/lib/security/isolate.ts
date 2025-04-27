import { RequestHandler } from "express";

const crossOriginIsolate: RequestHandler = (req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

    next();
};

export default crossOriginIsolate;