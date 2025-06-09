import { Router } from "express";

import googleRouter from "./google";

const router = Router();

router.use("/auth", googleRouter);

export default router;