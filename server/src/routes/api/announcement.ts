import { Router } from "express";
import { connection as database } from "mongoose";

import Collection from "@constants/Collection";

const router = Router();

router.get("/api/announcement", async (req, res) => {
    const announcement = await database
        .collection(Collection.ANNOUNCEMENT)
        .findOne({});

    res.json(announcement || {});
});

export default router;