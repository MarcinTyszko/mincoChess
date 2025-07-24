import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { Buffer } from "buffer";
import { omit } from "lodash-es";

import {
    SerializedAnalysedGame,
    analysedGameSchema
} from "shared/types/game/AnalysedGame";
import ArchivedGame from "@/database/models/ArchivedGame";
import { accountAuthenticator } from "@/lib/security/account";
import * as Archive from "@/lib/gameArchive";

const router = Router();

const maximumArchiveSize = Number(process.env.MAXIMUM_ARCHIVE_SIZE) || 50;

router.use("/analysis/archive",
    accountAuthenticator(),
    express.json({ limit: "500kb" })
);

router.get("/analysis/archive", async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const gameId = req.query.id?.toString();

    if (gameId) {
        const archivedGame = await ArchivedGame.findOne({
            _id: gameId
        }).lean();

        if (!archivedGame) return res.sendStatus(StatusCodes.NOT_FOUND);

        const game = await Archive.unarchiveAnalysedGame({
            ...omit(archivedGame, ["_id", "__v"]),
            userId: archivedGame.userId.toString(),
            gzippedStateTree: Buffer.copyBytesFrom(
                archivedGame.gzippedStateTree.buffer
            )
        });

        return res.json(game);
    }

    const archive = await ArchivedGame.find({
        userId: new Types.ObjectId(req.user.id)
    }).lean();

    res.json(
        archive.map(game => Archive.getArchivedGameMetadata(game))
    );
});

router.post("/analysis/archive/add", async (req, res) => {
    if (!req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const userArchiveSize = await ArchivedGame.countDocuments({
        userId: new Types.ObjectId(req.user.id)
    });

    if (userArchiveSize >= maximumArchiveSize)
        return res.sendStatus(StatusCodes.INSUFFICIENT_STORAGE);

    const analysedGame: SerializedAnalysedGame = req.body;

    if (!analysedGameSchema.safeParse(analysedGame).success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const archivedGame = await ArchivedGame.create({
        ...await Archive.archiveAnalysedGame(analysedGame, req.user.id),
        userId: new Types.ObjectId(req.user.id)
    });

    res.send(archivedGame._id.toString());
});

router.get("/analysis/archive/delete", async (req, res) => {
    const gameId = req.query.id?.toString();
    if (!gameId) return res.sendStatus(StatusCodes.BAD_REQUEST);

    const game = await ArchivedGame.findOne({ _id: gameId });

    if (!game) return res.sendStatus(StatusCodes.NOT_FOUND);

    if (game.userId.toString() != req.user?.id)
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    await game.deleteOne();

    res.sendStatus(StatusCodes.OK);
});

export default router;