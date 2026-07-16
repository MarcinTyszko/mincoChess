import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();

// The hostname the app is deployed on is always trusted, wherever
// that happens to be (e.g. chess.example.com behind Cloudflare)
const originHostname = (() => {
    try {
        return process.env.ORIGIN
            ? new URL(process.env.ORIGIN).hostname
            : null;
    } catch {
        return null;
    }
})();

// Local deployments are accessed via LAN IPs as well as localhost,
// so development mode also accepts private network addresses
const whitelistedHostnames = [
    /^(.+\.)?wintrchess\.com$/,
    ...(process.env.NODE_ENV == "development"
        ? [
            /^localhost$/,
            /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
            /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
            /^192\.168\.\d{1,3}\.\d{1,3}$/,
            /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/
        ] : []
    )
];

const hostnameWhitelist: RequestHandler = (req, res, next) => {
    const hostWhitelisted = req.hostname == originHostname
        || whitelistedHostnames.some(
            hostnameRegex => hostnameRegex.test(req.hostname)
        );

    if (!hostWhitelisted) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    next();
};

export default hostnameWhitelist;