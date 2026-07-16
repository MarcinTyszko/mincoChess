import { Types } from "mongoose";
import { gzipSync, gunzipSync } from "zlib";
import { Compressed, compress, decompress } from "compress-json";
import { Buffer } from "buffer";
import { omit } from "lodash-es";

import { SerializedAnalysedGame } from "shared/types/game/AnalysedGame";
import { ArchivedGame, ArchivedGameMetadata } from "shared/types/game/ArchivedGame";
import { SerializedStateTreeNode } from "shared/types/game/position/StateTreeNode";
import renderStateTree from "shared/lib/stateTree/render";
import ArchivedGameModel from "@/database/models/ArchivedGame";

/**
 * @description The deepest named opening reached along the mainline;
 * stored on the archived game as its automatic description.
 */
function getMainlineOpeningName(stateTree: SerializedStateTreeNode) {
    let openingName: string | undefined;
    let node: SerializedStateTreeNode | undefined = stateTree;

    while (node) {
        openingName = node.state.opening || openingName;
        node = node.children.at(0);
    }

    return openingName;
}

export async function archiveAnalysedGame(
    game: SerializedAnalysedGame,
    userId: string
): Promise<ArchivedGame> {
    const packedStateTree = JSON.stringify(
        compress(game.stateTree)
    );

    return {
        ...omit(game, ["pgn", "stateTree"]),
        openingName: getMainlineOpeningName(game.stateTree),
        userId: userId,
        gzippedStateTree: gzipSync(Buffer.from(packedStateTree))
    };
}

export async function unarchiveAnalysedGame(
    archivedGame: ArchivedGame
): Promise<SerializedAnalysedGame> {
    const packedStateTree: Compressed = JSON.parse(
        gunzipSync(archivedGame.gzippedStateTree).toString()
    );

    const stateTree: SerializedStateTreeNode = decompress(packedStateTree);

    return {
        ...omit(archivedGame, ["userId", "gzippedStateTree"]),
        pgn: renderStateTree(stateTree, archivedGame),
        stateTree: stateTree
    };
}

export async function clearArchivedGames(userId: string) {
    await ArchivedGameModel.deleteMany({
        userId: new Types.ObjectId(userId)
    });
}

export function getArchivedGameMetadata<T extends ArchivedGameMetadata>(
    game: T
): ArchivedGameMetadata {
    return {
        date: game.date,
        estimatedRatings: game.estimatedRatings,
        initialPosition: game.initialPosition,
        players: game.players,
        timeControl: game.timeControl,
        clock: game.clock,
        accuracies: game.accuracies,
        variant: game.variant,
        liked: game.liked,
        customName: game.customName,
        openingName: game.openingName
    };
}