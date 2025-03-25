import { clone, cloneDeep } from "lodash";

import StateTreeNode from "../types/game/StateTreeNode";

export function serializeStateTree(rootNode: StateTreeNode) {
    function serializeNode(node: StateTreeNode) {
        const nodeCopy = clone(node);

        nodeCopy.parent = undefined;
        nodeCopy.children = [];
        nodeCopy.state = cloneDeep(nodeCopy.state);

        for (const child of node.children) {
            nodeCopy.children.push(
                serializeNode(child)
            );
        }

        return nodeCopy;
    }

    return serializeNode(rootNode);
}