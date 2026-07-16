import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

import {
    LearningProgress,
    learningProgressSchema,
    emptyLearningProgress,
    mergeLearningProgress
} from "shared/types/LearningProgress";
import LearningProgressModel from "@/database/models/LearningProgress";
import { accountAuthenticator } from "@/lib/security/account";

const path = "/learning";

const router = Router();

router.use(path,
    accountAuthenticator(),
    express.json({ limit: "300kb" })
);

function adaptActivity(activity: unknown): Record<string, number> {
    if (!activity) return {};

    // Mongoose returns Map fields as Maps on documents but as plain
    // objects on .lean() queries; support both
    if (activity instanceof Map) {
        return Object.fromEntries(activity);
    }

    return activity as Record<string, number>;
}

router.get(path, async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const progress = await LearningProgressModel.findOne({
        userId: new Types.ObjectId(req.user.id)
    }).lean();

    if (!progress) return res.json(emptyLearningProgress);

    res.json({
        favourites: progress.favourites,
        completed: progress.completed,
        activity: adaptActivity(progress.activity)
    });
});

router.put(path, async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const parse = learningProgressSchema.safeParse(req.body);

    if (!parse.success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const userId = new Types.ObjectId(req.user.id);

    const existing = await LearningProgressModel.findOne({
        userId: userId
    }).lean();

    // Merge instead of overwriting, so no device can wipe out
    // progress that was made on another one
    const progress: LearningProgress = mergeLearningProgress(
        existing
            ? {
                favourites: existing.favourites,
                completed: existing.completed,
                activity: adaptActivity(existing.activity)
            }
            : emptyLearningProgress,
        parse.data
    );

    await LearningProgressModel.updateOne(
        { userId: userId },
        { $set: progress },
        { upsert: true }
    );

    res.json(progress);
});

export default router;
