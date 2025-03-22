import { Router } from "express";

import { Classification } from "wintrchess";

const router = Router();

router.post("/api/analysis/classify", async (req, res) => {
    res.json({
        mocked: "thing",
        classification: Classification.BRILLIANT
    });
});

export default router;