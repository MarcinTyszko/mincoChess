import { Router } from "express";
import { connection as database } from "mongoose";

import { Announcement } from "wintrchess";
import Collections from "../../lib/database/collections";

const router = Router();

router.post("/internal/announcement/publish", async (req, res) => {
    const { colour, content }: Announcement = req.body;

    await database
        .collection(Collections.ANNOUNCEMENT)
        .updateOne(
            {},
            {
                $set: {
                    colour,
                    content
                }
            },
            { upsert: true }
        );

    res.sendStatus(200);
});

export default router;