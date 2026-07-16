import { Router } from "express";

import appRouter from "@/lib/appRouter";
import internalAuthenticator from "@/lib/security/internal";

import loginRouter from "./login";
import publishAnnouncementRouter from "./publishAnnouncement";

const router = Router();

router.use("/internal",
    loginRouter,
    publishAnnouncementRouter
);

router.use("/internal",
    internalAuthenticator(true),
    appRouter("internal.html")
);

export default router;