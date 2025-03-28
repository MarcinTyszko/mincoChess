import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
    serializeGameAnalysis,
    deserializeGameAnalysis,
    SerializedGameAnalysis
} from "wintrchess";
import legacyGameReport from "@lib/legacy/gameReporter";

const router = Router();

router.post("/api/analysis/classify", async (req, res) => {
    // Verify existence of game analysis in request
    const serializedGameAnalysis: SerializedGameAnalysis | undefined = req.body;

    if (!serializedGameAnalysis) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    // Deserialize, classify and reserialize
    try {
        const reportedGameAnalysis = await legacyGameReport(
            deserializeGameAnalysis(serializedGameAnalysis)
        );
    
        res.json(
            serializeGameAnalysis(reportedGameAnalysis)
        );
    } catch {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default router;