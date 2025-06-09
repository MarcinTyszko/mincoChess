import { RequestHandler } from "express";
import { resolve } from "path";

function appRouter(filepath: string): RequestHandler {
    return async (req, res) => res.sendFile(
        resolve(`client/public/apps/${filepath}`)
    );
}

export default appRouter;