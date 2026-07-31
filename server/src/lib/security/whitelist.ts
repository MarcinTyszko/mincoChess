import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { originHostnames } from "./origins";

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

// The hostname comes from an attacker-controlled header, so the set of
// already-logged ones is capped; it exists to surface a misconfiguration,
// which shows up in the first few entries, not to track scanners
const rejectedHostnameLimit = 32;
const rejectedHostnames = new Set<string>();

const hostnameWhitelist: RequestHandler = (req, res, next) => {
    // Every hostname the app is deployed on is trusted, wherever those
    // happen to be (e.g. chess.example.com behind Cloudflare)
    const hostWhitelisted = originHostnames.includes(req.hostname)
        || whitelistedHostnames.some(
            hostnameRegex => hostnameRegex.test(req.hostname)
        );

    if (!hostWhitelisted) {
        // A misconfigured ORIGIN rejects every real visitor, and a bare 401
        // gives no hint why - so name the hostname that was turned away.
        // Once per hostname, or a scan would flood the log.
        if (
            !rejectedHostnames.has(req.hostname)
            && rejectedHostnames.size < rejectedHostnameLimit
        ) {
            rejectedHostnames.add(req.hostname);

            console.warn(
                `refused request for untrusted hostname "${req.hostname}";`
                + ` trusted: ${originHostnames.join(", ") || "(none)"}`
            );
        }

        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    next();
};

export default hostnameWhitelist;