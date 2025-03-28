import { StatusCodes } from "http-status-codes";

import {
    GameAnalysis,
    serializeStateTree,
    StateTreeNode
} from "wintrchess";

interface ClassificationResult {
    status: StatusCodes;
    gameAnalysis?: GameAnalysis;
}

async function classifyStateTree(rootNode: StateTreeNode) {
    const classifyResponse = await fetch("/api/analysis/classify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stateTree: serializeStateTree(rootNode)
        } as GameAnalysis)
    });

    return {
        status: classifyResponse.status,
        gameAnalysis: classifyResponse.ok
            ? await classifyResponse.json() : undefined
    } as ClassificationResult;
}

export default classifyStateTree;