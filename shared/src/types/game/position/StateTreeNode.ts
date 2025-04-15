import { Chess } from "chess.js";
import { round, clone, uniqueId } from "lodash";

import { BoardState } from "./BoardState";
import PieceColour from "@constants/PieceColour";

export interface StateTreeNode {
    id: string;
    mainline: boolean;
    state: BoardState;
    children: StateTreeNode[];
    parent?: StateTreeNode;
}

/**
 * @description Remove parent from node, and recurse through all
 * children to remove their parents, to remove cyclic references.
 */
export function serializeNode(rootNode: StateTreeNode) {
    function serializePart(part: StateTreeNode) {
        part.parent = undefined;

        part.children = part.children.map(
            child => serializePart(clone(child))
        );

        return part;
    }

    return serializePart(clone(rootNode));
}

/**
 * @description Recurses through children of a node N, setting
 * their parents back to N.
 */
export function deserializeNode(rootNode: StateTreeNode) {
    function deserializeNode(node: StateTreeNode, parent?: StateTreeNode) {
        const deserializedNode: StateTreeNode = {
            id: node.id,
            parent: parent,
            children: [],
            state: node.state,
            mainline: node.mainline
        };

        deserializedNode.children = node.children.map(
            child => deserializeNode(child, deserializedNode)
        );

        return deserializedNode;
    }

    return deserializeNode(rootNode);
}

/**
 * @description Search recursively for a node that passes a given
 * predicate, starting from and including a root node. Returns the
 * first passing node or undefined if one cannot be found
 */
export function findNodeRecursively(
    rootNode: StateTreeNode,
    predicate: (node: StateTreeNode) => boolean
) {
    const frontier: StateTreeNode[] = [rootNode];

    while (frontier.length > 0) {
        const node = frontier.pop();
        if (!node) break;

        if (predicate(node)) {
            return node;
        }

        frontier.push(...node.children);
    }
}

/**
 * @description Returns a list of the given node and its entire line
 * of priority children, or all children unordered if `expand` is true.
 */
export function getNodeChain(
    rootNode: StateTreeNode,
    expand?: boolean
) {
    const chain: StateTreeNode[] = [];

    const frontier: StateTreeNode[] = [rootNode];

    while (frontier.length > 0) {
        const current = frontier.pop();
        if (!current) break;

        chain.push(current);

        for (const child of current.children) {
            frontier.push(child);
            
            if (!expand) break;
        }
    }

    return chain;
}

/**
 * @description Returns the move number of the given node.
 */
export function getNodeMoveNumber(
    node: StateTreeNode,
    initialPosition?: string
) {
    let initialMoveNumber = 1;

    if (initialPosition) {
        const board = new Chess(initialPosition);
    
        initialMoveNumber = board.moveNumber()
            + (board.turn() == "b" ? 0.5 : 0);
    }

    let current: StateTreeNode = node;
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
 * @description Returns a list of the given node's siblings.
 */
export function getNodeSiblings(node: StateTreeNode) {
    return node.parent?.children.filter(
        child => child != node
    ) || [];
}

/**
 * @description Adds a child to the node based on the SAN move given;
 * returns the added node.
 */
export function addChildMove(node: StateTreeNode, san: string) {
    const existingNode = node.children.find(
        child => child.state.move?.san == san
    );
    
    const childMove = new Chess(node.state.fen).move(san);

    const createdNode: StateTreeNode = {
        id: uniqueId(),
        mainline: node.mainline
            && !node.children.some(
                child => child.mainline
            ),
        parent: node,
        children: [],
        state: {
            fen: childMove.after,
            engineLines: [],
            move: {
                san: childMove.san,
                uci: childMove.lan
            },
            moveColour: childMove.color == "w"
                ? PieceColour.WHITE
                : PieceColour.BLACK
        }
    };

    if (!existingNode) {
        node.children.push(createdNode);
    }

    return existingNode || createdNode;
}