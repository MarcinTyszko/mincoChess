import React from "react";

import { PieceColour, StateTreeNode } from "wintrchess";
import LineGroup from "./components/LineGroup";

interface NodeGroup {
    indentCount: number;
    nodes: (StateTreeNode | null)[];
}

function generateTreeView(rootNode: StateTreeNode) {
    const nodeGroups: NodeGroup[] = [];

    function nodeGroupOf(target: StateTreeNode) {
        return nodeGroups.find(
            group => group.nodes.some(node => node == target)
        );
    }

    function renderChildrenOf(node: StateTreeNode, indentCount: number) {
        // Push the priority child first
        const firstChild = node.children.at(0);
        if (!firstChild) return;

        // Check possibility of merging with group
        // Cannot merge if the white node is the root
        if (
            firstChild.state.moveColour == PieceColour.BLACK
            && !(firstChild.hasSiblings() && node.hasSiblings())
            && node.parent
        ) {
            nodeGroupOf(node)?.nodes.push(firstChild);
        } else {
            nodeGroups.push({
                indentCount: indentCount,
                nodes: [firstChild]
            });
        }

        // Recursively render the rest of the children
        for (const child of node.children.slice(1)) {
            nodeGroups.push({
                indentCount: indentCount + 1,
                nodes: [child]
            });

            renderChildrenOf(child, indentCount + 1);
        }

        // Recursively render the priority child
        renderChildrenOf(firstChild, indentCount);
    }

    renderChildrenOf(rootNode, 0);

    return nodeGroups.map(
        group => <LineGroup
            {...group}
            initialPosition={rootNode.state.fen}
        />
    );
}

export default generateTreeView;