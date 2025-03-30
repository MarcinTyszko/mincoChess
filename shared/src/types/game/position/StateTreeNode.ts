import { Chess } from "chess.js";
import { round } from "lodash";

import { serializeObject } from "../../../lib/serialization";
import {
    BoardState,
    deserializeBoardState,
    SerializedBoardState
} from "./BoardState";
import PieceColour from "../../../constants/PieceColour";

interface StateTreeNodeProps {
    mainline: boolean;
    state: BoardState;
    children: StateTreeNode[];
    parent?: StateTreeNode;
}

export interface SerializedStateTreeNode {
    mainline: boolean;
    state: SerializedBoardState;
    children: SerializedStateTreeNode[];
}

export class StateTreeNode {
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

    serialize(): SerializedStateTreeNode {
        return serializeObject({
            children: this.children.map(child => child.serialize()),
            mainline: this.mainline,
            state: this.state.serialize()
        });
    }

    /**
     * @description Follows the priority child until there are no
     * children. Returns all nodes traversed throughout.
     */
    chain() {
        const chain: StateTreeNode[] = [this];

        let current: StateTreeNode = this;

        while (current.children.length > 0) {
            current = current.children[0];

            chain.push(current);
        }

        return chain;
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
        for (const node of this.chain()) {
            node.mainline = true;
        }
    }

    /**
     * @description Adds a child node from a SAN move, accounting for possible
     * mainline and a pre-existing node of the same move. Returns child node.
     */
    addChildMove(san: string) {
        const existingNode = this.children.find(
            child => child.state.move?.san == san
        );
        
        const childMove = new Chess(this.state.fen).move(san);

        const createdNode = new StateTreeNode({
            mainline: this.mainline
                && !this.children.some(
                    child => child.mainline
                ),
            parent: this,
            children: [],
            state: new BoardState({
                fen: childMove.after,
                move: {
                    san: childMove.san,
                    uci: childMove.lan
                },
                moveColour: childMove.color == "w"
                    ? PieceColour.WHITE
                    : PieceColour.BLACK
            })
        });

        if (!existingNode) {
            this.children.push(createdNode);
        }

        return existingNode || createdNode;
    }
}

export function deserializeStateTree(rootNode: SerializedStateTreeNode) {
    function deserializeNode(node: SerializedStateTreeNode, parent?: StateTreeNode) {
        const deserializedNode = new StateTreeNode({
            parent: parent,
            children: [],
            state: deserializeBoardState(node.state),
            mainline: node.mainline
        });

        deserializedNode.children = node.children.map(
            child => deserializeNode(child, deserializedNode)
        );

        return deserializedNode;
    }

    return deserializeNode(rootNode);
}