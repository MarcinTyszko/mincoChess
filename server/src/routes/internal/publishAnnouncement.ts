import express, { Router } from "express";

import Announcement from "shared/types/Announcement";
import AnnouncementModel from "@database/models/Announcement";
import internalAuthenticator from "@lib/security/internal";

const path = "/announcement/publish";

const router = Router();

router.use(path,
    express.json(),
    internalAuthenticator()
);

router.post(path, async (req, res) => {
    const { colour, content }: Announcement = req.body;

    await AnnouncementModel.updateOne({},
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