import { Router } from "express";

import captchaRouter from "./captcha";
import googleRouter from "./google";

const router = Router();

router.use("/auth",
    captchaRouter,
    googleRouter
);

export default router;