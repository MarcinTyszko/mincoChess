import { StatusCodes } from "http-status-codes";
import { clone } from "lodash-es";

import { GameAnalysis } from "shared/types/game/GameAnalysis";
import ReportOptions from "shared/lib/reporter/types/ReportOptions";
import {
    StateTreeNode,
    serializeNode,
    deserializeNode
} from "shared/types/game/position/StateTreeNode";

interface AnalyseGameResult {
    status: StatusCodes;
    gameAnalysis?: GameAnalysis;
}

interface AnalyseNodeResult {
    status: StatusCodes;
    node?: StateTreeNode;
}

/**
 * @description Does not require given root node to be serialized
 */
export async function analyseStateTree(
    rootNode: StateTreeNode,
    options?: ReportOptions
): Promise<AnalyseGameResult> {
    const reportURL = "/api/analysis/analyse"
        + `?brilliant=${String(options?.includeBrilliant)}`
        + `&critical=${String(options?.includeCritical)}`
        + `&theory=${String(options?.includeTheory)}`;

    const reportResponse = await fetch(reportURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            serializeNode(rootNode)
        )
    });

    if (!reportResponse.ok) {
        return { status: reportResponse.status };
    }

    const gameAnalysis: GameAnalysis = await reportResponse.json();

    gameAnalysis.stateTree = deserializeNode(
        gameAnalysis.stateTree,
        rootNode
    );

    return {
        status: reportResponse.status,
        gameAnalysis: gameAnalysis
    };
}

/**
 * @description Does not require given node to be serialized
 */
export async function analyseNode(
    node: StateTreeNode,
    options?: ReportOptions
): Promise<AnalyseNodeResult> {
    if (!node.parent) {
        return { status: StatusCodes.BAD_REQUEST };
    }

    const childlessNode = clone(node);
    childlessNode.children = [];

    const parentNode = clone(node.parent);
    parentNode.children = [childlessNode];

    const reportResult = await analyseStateTree(parentNode, options);
    const analysedNode = reportResult.gameAnalysis?.stateTree.children.at(0);

    return {
        status: reportResult.status,
        node: analysedNode
    };
}