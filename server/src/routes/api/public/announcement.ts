import { Router } from "express";

import Announcement from "@database/models/Announcement";

const router = Router();

router.get("/announcement", async (req, res) => {
    const announcement = await Announcement.findOne();

    res.json(announcement || {});
});

export default router;