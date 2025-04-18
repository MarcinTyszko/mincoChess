import { meanBy } from "lodash";

import { getNodeChain, StateTreeNode } from "@ctypes/game/position/StateTreeNode";
import PieceColour from "@constants/PieceColour";

export function getGameAccuracy(rootNode: StateTreeNode) {
    const accuracyHolders = getNodeChain(rootNode).filter(
        node => node.state.accuracy != undefined
    );

    const whiteNodes = accuracyHolders.filter(
        node => node.state.moveColour == PieceColour.WHITE
    );

    const blackNodes = accuracyHolders.filter(
        node => node.state.moveColour == PieceColour.BLACK
    );

    return {
        white: meanBy(whiteNodes, node => node.state.accuracy!),
        black: meanBy(blackNodes, node => node.state.accuracy!)
    };
}