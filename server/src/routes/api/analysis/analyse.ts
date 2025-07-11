import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
    StateTreeNode,
    serializeNode,
    deserializeNode
} from "shared/types/game/position/StateTreeNode";
import { getGameReport } from "shared/lib/reporter/report";
import analysisAuthenticator from "@lib/security/analysis";

const path = "/analysis/analyse";

const router = Router();

router.use(path,
    analysisAuthenticator,
    express.json({ limit: "1mb" })
);

router.post(path, async (req, res) => {
    const serializedStateTree: StateTreeNode | undefined = req.body;

    if (!serializedStateTree) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const stateTree = deserializeNode(serializedStateTree);

    try {
        const gameReport = getGameReport(stateTree, {
            includeBrilliant: req.query.brilliant == "true",
            includeCritical: req.query.critical == "true",
            includeTheory: req.query.theory == "true"
        });
        
        gameReport.stateTree = serializeNode(gameReport.stateTree);

        res.json(gameReport);
    } catch {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default router;