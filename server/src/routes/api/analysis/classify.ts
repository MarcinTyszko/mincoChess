import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { GameAnalysis } from "wintrchess";

const router = Router();

router.post("/api/analysis/classify", async (req, res) => {
    const gameAnalysis: GameAnalysis | undefined = req.body;

    if (!gameAnalysis) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    gameAnalysis.accuracies.white = 95.6;
    gameAnalysis.accuracies.black = 82.1;

    res.json(gameAnalysis);
});

export default router;