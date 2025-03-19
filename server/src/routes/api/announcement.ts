import { Router } from "express";
import { connection as database } from "mongoose";

import Collections from "../../constants/collection";

const router = Router();

router.get("/api/announcement", async (req, res) => {
    const announcement = await database
        .collection(Collections.ANNOUNCEMENT)
        .findOne({});

    res.json(announcement || {});
});

export default router;