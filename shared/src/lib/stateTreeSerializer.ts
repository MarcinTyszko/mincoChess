import { clone, cloneDeep } from "lodash";

import StateTreeNode from "../types/game/StateTreeNode";

export function serializeStateTree(rootNode: StateTreeNode) {
    function serializeNode(node: StateTreeNode) {
        const nodeCopy = clone(node);

        nodeCopy.parent = undefined;
        nodeCopy.children = [];
        nodeCopy.state = cloneDeep(nodeCopy.state);
        
        nodeCopy.state.engineLines = nodeCopy.state.engineLines.map(line => {
            line.moves = line.moves.slice(0, 1);
            return line;
        });

        for (const child of node.children) {
            nodeCopy.children.push(
                serializeNode(child)
            );
        }

        return nodeCopy;
    }

    return serializeNode(rootNode);
}