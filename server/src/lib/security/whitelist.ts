import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

export const whitelistedHostnames = [
    /.*\.?wintrchess\.com/,
    ...(process.env.NODE_ENV == "development"
        ? [/localhost/] : []
    )
];

export const hostnameWhitelist: RequestHandler = (req, res, next) => {
    const hostWhitelisted = whitelistedHostnames.some(
        hostnameRegex => hostnameRegex.test(req.hostname)
    );

    if (!hostWhitelisted) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    next();
};