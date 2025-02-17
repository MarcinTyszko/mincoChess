import { Chess } from "chess.js";
import { round } from "lodash";

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
     * @description Recurse through priority children until the end
     * of the tree is reached. Returns the final node.
     */
    finalNode() {
        let current: StateTreeNode = this;

        while (current.children.length > 0) {
            current = current.children[0];
        }

        return current;
    }

    /**
     * @description The move number of the node. Can be an integer
     * or end in 0.5 if the move was played by black.
     */
    moveNumber(initialPosition?: string) {
        let initialMoveNumber = 1;

        if (initialPosition) {
            const board = new Chess(initialPosition);
        
            initialMoveNumber = board.moveNumber()
                + (board.turn() == "b" ? 0.5 : 0);
        }

        let current: StateTreeNode = this;
        let depth = 0;

        while (current?.parent) {
            current = current.parent;
            depth++;
        }

        // current = Root Node at this point
        let pairDepth = (depth - 1) / 2;

        return round(pairDepth, 1) + initialMoveNumber;
    }

    /**
     * @description Returns whether or not this node has siblings.
     */
    hasSiblings() {
        return (this.parent?.children.length || 0) > 1;
    }

    /**
     * @description Promote this node and it's priority child line into
     * the mainline.
     */
    mainlinePromote() {
        this.mainline = true;

        let current: StateTreeNode = this;

        while (current.children.length > 0) {
            current = current.children[0];

            current.mainline = true;
        }
    }
}

export default StateTreeNode;