import { Router } from "express";

import captchaRouter from "./captcha";
import googleRouter from "./google";
import registerRouter from "./register";
import verifyEmailRouter from "./verify";
import loginRouter from "./login";
import logoutRouter from "./logout";
import updateRouter from "./update";

const router = Router();

router.use("/auth",
    captchaRouter,
    googleRouter,
    registerRouter,
    verifyEmailRouter,
    loginRouter,
    logoutRouter,
    updateRouter
);

export default router;