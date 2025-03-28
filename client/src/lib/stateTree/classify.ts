import { StatusCodes } from "http-status-codes";

import {
    deserializeStateTree,
    GameAnalysis,
    SerializedGameAnalysis,
    serializeStateTree,
    StateTreeNode
} from "wintrchess";

interface ClassificationResult {
    status: StatusCodes;
    gameAnalysis?: GameAnalysis;
}

async function classifyStateTree(
    rootNode: StateTreeNode
): Promise<ClassificationResult> {
    const classifyResponse = await fetch("/api/analysis/classify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stateTree: serializeStateTree(rootNode)
        } as SerializedGameAnalysis)
    });

    if (!classifyResponse.ok) {
        return { status: classifyResponse.status };
    }

    const gameAnalysis: SerializedGameAnalysis = await classifyResponse.json();

    return {
        status: classifyResponse.status,
        gameAnalysis: {
            ...gameAnalysis,
            stateTree: deserializeStateTree(gameAnalysis.stateTree)
        }
    };
}

export default classifyStateTree;