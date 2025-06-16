import { Router } from "express";

import captchaRouter from "./captcha";
import googleRouter from "./google";
import registerRouter from "./register";
import verifyEmailRouter from "./verify";

const router = Router();

router.use("/auth",
    captchaRouter,
    googleRouter,
    registerRouter,
    verifyEmailRouter
);

export default router;