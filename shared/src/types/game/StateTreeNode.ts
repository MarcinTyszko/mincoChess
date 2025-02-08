import { round } from "lodash";

import PieceColour from "../../constants/PieceColour";
import BoardState from "./BoardState";

interface StateTreeNodeProps {
    mainline: boolean;
    state: BoardState;
    children: StateTreeNode[];
    parent?: StateTreeNode;
}

class StateTreeNode {
    mainline: boolean;
    state: BoardState;
    children: StateTreeNode[];
    parent?: StateTreeNode;

    constructor(props: StateTreeNodeProps) {
        this.mainline = props.mainline;
        this.parent = props.parent;
        this.children = props.children;
        this.state = props.state;
    }

    /**
     * @description The move number of the node. Can be an integer
     * or end in 0.5 if the move was played by black.
     */
    moveNumber() {
        let current: StateTreeNode = this;
        let depth = 0;

        while (current?.parent) {
            current = current.parent;
            depth++;
        }

        // current = Root Node at this point
        let pairDepth = (depth - 1) / 2;

        const firstMoveColour = current.children.at(0)?.state.moveColour;

        if (firstMoveColour == PieceColour.BLACK) {
            pairDepth += 0.5;
        }

        return round(pairDepth, 1);
    }

    /**
     * @description Returns whether or not this node has siblings.
     */
    hasVariations() {
        return (this.parent?.children.length || 0) > 1;
    }
}

export default StateTreeNode;