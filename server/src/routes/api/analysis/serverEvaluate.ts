import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { validateFen } from "chess.js";

import { EngineLine } from "shared/types/game/position/EngineLine";
import { accountAuthenticator } from "@/lib/security/account";
import {
    ServerEngine,
    enginePoolSize,
    serverEnginePool
} from "@/lib/serverEngine";

const path = "/analysis/server-evaluate";

const router = Router();

const maximumBatchSize = 24;

const evaluationRequestSchema = z.object({
    positions: z.array(
        z.string().refine(fen => validateFen(fen).ok)
    ).min(1).max(maximumBatchSize),
    depth: z.number().int().min(8).max(24),
    lines: z.number().int().min(1).max(5),
    timeLimit: z.number().min(100).max(30000).optional()
});

router.use(path,
    accountAuthenticator(),
    express.json({ limit: "200kb" })
);

router.post(path, async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const parse = evaluationRequestSchema.safeParse(req.body);

    if (!parse.success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const { positions, depth, lines, timeLimit } = parse.data;

    const engines: ServerEngine[] = [];

    try {
        // One engine is guaranteed, in request order; extra engines are
        // taken only while the shared pool has idle capacity, so several
        // users evaluating at once each keep making progress
        engines.push(await serverEnginePool.acquire());

        const targetEngineCount = Math.min(
            enginePoolSize, positions.length
        );

        while (engines.length < targetEngineCount) {
            const extraEngine = serverEnginePool.tryAcquire();

            if (!extraEngine) break;

            engines.push(extraEngine);
        }

        await Promise.all(engines.map(engine => engine.ready()));

        // Engines pull the next position off a shared queue, so the
        // whole batch is evaluated in parallel
        const evaluations: EngineLine[][] = positions.map(() => []);
        let nextPosition = 0;

        await Promise.all(engines.map(async engine => {
            while (nextPosition < positions.length) {
                const positionIndex = nextPosition++;

                evaluations[positionIndex] = await engine.evaluate(
                    positions[positionIndex],
                    { depth, lines, timeLimit }
                );
            }
        }));

        res.json({ evaluations });

        engines.forEach(engine => serverEnginePool.release(engine));
    } catch (err) {
        console.error("server evaluation failed:", err);

        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);

        // Engine states are unknown after a failure; replace instead
        // of returning them to the pool
        engines.forEach(engine => serverEnginePool.discard(engine));
    }
});

export default router;
