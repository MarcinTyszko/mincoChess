import { StatusCodes } from "http-status-codes";

import AnalysedGame, { SerializedAnalysedGame } from "shared/types/game/AnalysedGame";
import { ArchivedGameMetadata } from "shared/types/game/ArchivedGame";
import { deserializeNode, serializeNode } from "shared/types/game/position/StateTreeNode";

export async function getArchivedGames() {
    const response = await fetch("/api/analysis/archive");

    if (!response.ok) return {
        status: response.status as StatusCodes
    };

    return {
        status: response.status as StatusCodes,
        games: await response.json() as ArchivedGameMetadata[]
    };
}

export async function getArchivedGame(gameId: string) {
    const response = await fetch(`/api/analysis/archive?id=${gameId}`);

    if (!response.ok) return {
        status: response.status as StatusCodes
    };

    const serializedGame: SerializedAnalysedGame = await response.json();

    const game: AnalysedGame = {
        ...serializedGame,
        stateTree: deserializeNode(serializedGame.stateTree)
    };

    return { status: response.status as StatusCodes, game };
}

export async function archiveGame(game: AnalysedGame) {
    const response = await fetch("/api/analysis/archive/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...game,
            stateTree: serializeNode(game.stateTree)
        })
    });

    if (!response.ok) {
        return { status: response.status as StatusCodes };
    }

    return {
        status: response.status as StatusCodes,
        id: await response.text()
    };
}

export async function deleteArchivedGame(gameId: string) {
    const response = await fetch(`/api/analysis/archive/delete?id=${gameId}`);

    return { status: response.status as StatusCodes };
}