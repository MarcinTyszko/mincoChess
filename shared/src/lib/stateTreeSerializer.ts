import { cloneDeep } from "lodash";

import StateTreeNode from "../types/game/StateTreeNode";
import SerializedStateTreeNode from "../types/game/serialized/SerializedStateTreeNode";

export function serializeStateTree(rootNode: StateTreeNode) {
    function serializeNode(node: StateTreeNode) {
        const serializedNode: SerializedStateTreeNode = {
            children: [],
            state: cloneDeep(node.state),
            mainline: node.mainline
        };
        
        serializedNode.state.engineLines = serializedNode.state.engineLines
            .map(line => {
                line.moves = line.moves.slice(0, 1);
                return line;
            });

        for (const child of node.children) {
            serializedNode.children.push(
                serializeNode(child)
            );
        }

        return serializedNode;
    }

    return serializeNode(rootNode);
}

export function deserializeStateTree(rootNode: SerializedStateTreeNode) {
    function deserializeNode(node: SerializedStateTreeNode, parent?: StateTreeNode) {
        const deserializedNode = new StateTreeNode({
            parent: parent,
            children: [],
            state: node.state,
            mainline: node.mainline
        });

        deserializedNode.children = node.children.map(
            child => deserializeNode(child, deserializedNode)
        );

        return deserializedNode;
    }

    return deserializeNode(rootNode);
}