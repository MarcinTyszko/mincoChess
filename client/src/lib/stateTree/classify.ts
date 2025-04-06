import { StatusCodes } from "http-status-codes";
import { clone } from "lodash";

import {
    Classification,
    GameAnalysis,
    StateTreeNode,
    serializeNode,
    deserializeNode
} from "wintrchess";

interface ClassifyTreeResult {
    status: StatusCodes;
    gameAnalysis?: GameAnalysis;
}

interface ClassifyNodeResult {
    status: StatusCodes;
    classification?: Classification;
}

/**
 * @description Does not require given root node to be
 * serialized.
 */
export async function classifyStateTree(
    rootNode: StateTreeNode
): Promise<ClassifyTreeResult> {
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

/**
 * @description Does not require given node to be serialized
 */
export async function classifyNode(
    node: StateTreeNode
): Promise<ClassifyNodeResult> {
    if (!node.parent) {
        return { status: StatusCodes.BAD_REQUEST };
    }

    const childlessNode = clone(node);
    childlessNode.children = [];

    const parentNode = clone(node.parent);
    parentNode.children = [childlessNode];

    const classificationResult = await classifyStateTree(parentNode);
    const classifiedNode = classificationResult.gameAnalysis?.stateTree.children[0];

    if (
        classificationResult.status != StatusCodes.OK
        || !classifiedNode 
    ) {
        return { status: classificationResult.status };
    }

    return {
        status: classificationResult.status,
        classification: classifiedNode.state.classification
    };
}