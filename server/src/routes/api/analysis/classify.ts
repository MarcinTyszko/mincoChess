import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
    StateTreeNode,
    serializeNode,
    deserializeNode,
    getGameReport
} from "wintrchess";

const path = "/api/analysis/classify";

const router = Router();

router.use(
    path,
    express.json({ limit: "1mb" })
);

router.post(path, async (req, res) => {
    const serializedStateTree: StateTreeNode | undefined = req.body;

    if (!serializedStateTree) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const stateTree = deserializeNode(serializedStateTree);

    try {
        const gameReport = getGameReport(stateTree);
        
        gameReport.stateTree = serializeNode(gameReport.stateTree);

        res.json(gameReport);
    } catch {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default router;