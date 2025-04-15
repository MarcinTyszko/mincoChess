import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
    StateTreeNode,
    GameAnalysis,
    serializeNode,
    deserializeNode,
    classifyTree
} from "wintrchess";

const path = "/api/analysis/classify";

const router = Router();

router.use(
    path,
    express.json({ limit: "1mb" })
);

router.post(path, async (req, res) => {
    let stateTree: StateTreeNode | undefined = req.body;

    if (!stateTree) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    stateTree = deserializeNode(stateTree);

    try {
        classifyTree(stateTree);
    
        const analysis: GameAnalysis = {
            accuracies: {
                white: 50,
                black: 75
            },
            stateTree: serializeNode(stateTree)
        };

        res.json(analysis);
    } catch {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default router;