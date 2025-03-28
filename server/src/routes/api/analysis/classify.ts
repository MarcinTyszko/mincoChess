import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
    serializeStateTree,
    deserializeStateTree,
    SerializedGameAnalysis
} from "wintrchess";
import gameReport from "@lib/legacy/gameReporter";

const router = Router();

router.post("/api/analysis/classify", async (req, res) => {
    // Verify existence of game analysis in request
    const serializedGameAnalysis: SerializedGameAnalysis | undefined = req.body;

    if (!serializedGameAnalysis) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    // Deserialize, classify and reserialize
    const reportedGameAnalysis = await gameReport({
        ...serializedGameAnalysis,
        stateTree: deserializeStateTree(serializedGameAnalysis.stateTree)
    });

    res.json({
        ...reportedGameAnalysis,
        stateTree: serializeStateTree(reportedGameAnalysis.stateTree)
    } as SerializedGameAnalysis);
});

export default router;