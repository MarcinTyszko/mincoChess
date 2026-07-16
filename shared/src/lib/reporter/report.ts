import { GameAnalysis } from "@/types/game/GameAnalysis";
import { StateTreeNode, getNodeChain } from "@/types/game/position/StateTreeNode";
import AnalysisOptions from "./types/AnalysisOptions";
import { Classification } from "@/constants/Classification";
import { adaptPieceColour } from "@/constants/PieceColour";
import {
    extractCurrentStateTreeNode,
    extractPreviousStateTreeNode
} from "./utils/extractNode";
import { getOpeningName } from "./utils/opening";
import { getMoveAccuracy } from "./accuracy";
import { classify } from "./classify";
import {
    RatedMoveRecord,
    estimateGameRatings,
    getCentipawnLoss,
    getGamePhase
} from "./estimateRating";

export function getGameAnalysis(
    rootNode: StateTreeNode,
    options?: AnalysisOptions
): GameAnalysis {
    const treeNodes = getNodeChain(rootNode);

    const ratedMoveRecords: RatedMoveRecord[] = [];
    let ply = 0;

    for (const node of treeNodes) {
        try {
            node.state.classification = classify(node, options);
        } catch (err) {
            node.state.classification = undefined;
        }

        node.state.opening = getOpeningName(node.state.fen);

        if (!node.parent) continue;

        ply++;

        const previous = extractPreviousStateTreeNode(node.parent);
        const current = extractCurrentStateTreeNode(node);

        if (!previous || !current) continue;

        const moveColour = adaptPieceColour(current.playedMove.color);

        node.state.accuracy = getMoveAccuracy(
            previous.evaluation,
            current.evaluation,
            moveColour
        );

        ratedMoveRecords.push({
            colour: moveColour,
            accuracy: node.state.accuracy,
            classification: node.state.classification,
            centipawnLoss: getCentipawnLoss(
                previous.evaluation,
                current.evaluation,
                moveColour
            ),
            phase: getGamePhase(
                node.state.fen,
                Math.ceil(ply / 2),
                node.state.opening != undefined
                    || node.state.classification == Classification.THEORY
            )
        });
    }

    return {
        estimatedRatings: estimateGameRatings(
            ratedMoveRecords,
            options?.declaredRatings
        ),
        stateTree: rootNode
    };
}
