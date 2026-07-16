import { Router } from "express";

import announcementRouter from "./announcement";
import profileRouter from "./profile";
import archivedGameRouter from "./archivedGame";

const router = Router();

router.use("/public",
    announcementRouter,
    profileRouter,
    archivedGameRouter
);

export default router;