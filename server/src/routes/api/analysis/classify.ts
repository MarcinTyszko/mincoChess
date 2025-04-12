import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
    serializeNode,
    deserializeNode,
    StateTreeNode
} from "wintrchess";
import legacyGameReport from "@lib/legacy/gameReporter";

const path = "/api/analysis/classify";

const router = Router();

router.use(
    path,
    express.json({ limit: "1mb" })
);

router.post(path, async (req, res) => {
    // Verify existence of game analysis in request
    let stateTree: StateTreeNode | undefined = req.body;

    if (!stateTree) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    stateTree = deserializeNode(stateTree);

    // Deserialize, classify and reserialize
    try {
        const reportedGameAnalysis = await legacyGameReport(stateTree);

        reportedGameAnalysis.stateTree = serializeNode(reportedGameAnalysis.stateTree);
    
        res.json(reportedGameAnalysis);
    } catch {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default router;