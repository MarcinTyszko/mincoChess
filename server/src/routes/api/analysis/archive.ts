import express, { Router } from "express";
import z from "zod";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { omit } from "lodash-es";

import {
    SerializedAnalysedGame,
    analysedGameSchema
} from "shared/types/game/AnalysedGame";
import { getGameAccuracy } from "shared/lib/reporter/accuracy";
import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import ArchivedGame from "@/database/models/ArchivedGame";
import { GameArchive } from "shared/types/game/ArchivedGame";
import { accountAuthenticator } from "@/lib/security/account";
import * as Archive from "@/lib/gameArchive";

const router = Router();

// Per-user archive cap. Kept generous by default: with automatic
// analysis of recent games enabled, a low cap fills up and then every
// further game reaches 100% only to fail saving with 507, which looks
// exactly like the analysis "breaking". Override via env if needed.
const maximumArchiveSize = Number(process.env.MAXIMUM_ARCHIVE_SIZE) || 1000;

router.use("/analysis/archive",
    accountAuthenticator(),
    express.json({ limit: "500kb" })
);

router.get("/analysis/archive", async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const rawArchive = await ArchivedGame.find({
        userId: new Types.ObjectId(req.user.id)
    }).lean();

    // Backfill accuracies onto games archived before they were kept
    // as metadata, so listings can show them without the state tree
    for (const archivedGame of rawArchive) {
        if (archivedGame.accuracies) continue;

        try {
            const analysedGame = await Archive.unarchiveAnalysedGame({
                ...omit(archivedGame, ["_id", "__v"]),
                userId: archivedGame.userId.toString(),
                gzippedStateTree: Buffer.copyBytesFrom(
                    archivedGame.gzippedStateTree.buffer
                )
            });

            const gameAccuracy = getGameAccuracy(
                analysedGame.stateTree as unknown as StateTreeNode
            );

            const accuracies = {
                white: isNaN(gameAccuracy.white)
                    ? undefined : gameAccuracy.white,
                black: isNaN(gameAccuracy.black)
                    ? undefined : gameAccuracy.black
            };

            if (
                accuracies.white == undefined
                && accuracies.black == undefined
            ) continue;

            archivedGame.accuracies = accuracies;

            await ArchivedGame.updateOne(
                { _id: archivedGame._id },
                { $set: { accuracies } }
            );
        } catch {
            // Unreadable state tree; leave the accuracy blank
        }
    }

    const archive: GameArchive = Object.fromEntries(
        rawArchive.map(archivedGame => [
            archivedGame._id.toString(),
            Archive.getArchivedGameMetadata(archivedGame)
        ])
    );

    res.json(archive);
});

router.post("/analysis/archive/add", async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const analysedGame: SerializedAnalysedGame = req.body;

    if (!analysedGameSchema.safeParse(analysedGame).success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const gameId = req.query.id?.toString();

    const existingGame = gameId
        ? await ArchivedGame.findById(gameId)
        : null;

    // Compress the provided analysed game
    const archivedGame = await Archive.archiveAnalysedGame(
        analysedGame, req.user.id
    );

    if (existingGame?.userId.toString() == req.user.id) {
        // Update existing archived game
        await existingGame.updateOne(
            omit(archivedGame, ["userId"])
        );

        return res.send(existingGame._id.toString());
    }

    // Check for maximum archive size
    const userArchiveSize = await ArchivedGame.countDocuments({
        userId: new Types.ObjectId(req.user.id)
    });

    if (userArchiveSize >= maximumArchiveSize)
        return res.sendStatus(StatusCodes.INSUFFICIENT_STORAGE);

    // Create new archived game
    const archiveEntry = await ArchivedGame.create({
        ...archivedGame,
        userId: new Types.ObjectId(req.user.id)
    });

    res.send(archiveEntry._id.toString());
});

const archiveUpdateSchema = z.object({
    id: z.string(),
    liked: z.boolean().optional(),
    customName: z.string().max(80).optional()
});

router.post("/analysis/archive/update", async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const parse = archiveUpdateSchema.safeParse(req.body);

    if (!parse.success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const update = await ArchivedGame.updateOne(
        {
            _id: new Types.ObjectId(parse.data.id),
            userId: new Types.ObjectId(req.user.id)
        },
        { $set: omit(parse.data, ["id"]) }
    );

    if (update.matchedCount == 0)
        return res.sendStatus(StatusCodes.NOT_FOUND);

    res.sendStatus(StatusCodes.OK);
});

router.post("/analysis/archive/delete", async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const gameIds: string[] = req.body;

    if (!z.string().array().safeParse(gameIds).success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const deletion = await ArchivedGame.deleteMany({
        _id: { $in: gameIds.map(gameId => new Types.ObjectId(gameId)) },
        userId: new Types.ObjectId(req.user.id)
    });

    if (deletion.deletedCount == 0)
        return res.sendStatus(StatusCodes.NOT_FOUND);

    res.sendStatus(StatusCodes.OK);
});

export default router;