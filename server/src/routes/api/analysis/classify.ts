import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { AnalysisGame } from "wintrchess";

const router = Router();

router.post("/api/analysis/classify", async (req, res) => {
    const analysisGame: AnalysisGame | undefined = req.body;

    if (!analysisGame) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    analysisGame.accuracies.white = 95.6;
    analysisGame.accuracies.black = 82.1;

    res.json(analysisGame);
});

export default router;