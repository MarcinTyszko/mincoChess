import { StatusCodes } from "http-status-codes";

import {
    GameAnalysis,
    StateTreeNode,
    serializeNode,
    deserializeNode
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
        body: JSON.stringify(
            serializeNode(rootNode)
        )
    });

    if (!classifyResponse.ok) {
        return { status: classifyResponse.status };
    }

    const processedAnalysis: GameAnalysis = await classifyResponse.json();

    processedAnalysis.stateTree = deserializeNode(processedAnalysis.stateTree);

    return {
        status: classifyResponse.status,
        gameAnalysis: processedAnalysis
    };
}

export default classifyStateTree;