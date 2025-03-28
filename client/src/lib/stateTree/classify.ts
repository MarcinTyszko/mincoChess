import { StatusCodes } from "http-status-codes";

import {
    GameAnalysis,
    SerializedGameAnalysis,
    serializeStateTree,
    deserializeGameAnalysis,
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
        gameAnalysis: deserializeGameAnalysis(gameAnalysis)
    };
}

export default classifyStateTree;