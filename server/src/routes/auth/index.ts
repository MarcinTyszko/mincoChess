import { Router } from "express";

import captchaRouter from "./captcha";
import analysisSessionRouter from "./analysisSession";

const router = Router();

router.use("/auth",
    captchaRouter,
    analysisSessionRouter
);

export default router;