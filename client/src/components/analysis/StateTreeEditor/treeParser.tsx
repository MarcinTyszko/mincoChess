import React from "react";

import { PieceColour, StateTreeNode } from "wintrchess";
import LineGroup from "./components/LineGroup";

interface NodeGroup {
    indentCount: number;
    nodes: (StateTreeNode | null)[];
}

function generateTreeView(rootNode: StateTreeNode) {
    // Each line group is a list of tree nodes in it
    const nodeGroups: NodeGroup[] = [];

    function nodeGroupOf(targetNode: StateTreeNode) {
        return nodeGroups.find(
            group => group.nodes.some(node => node == targetNode)
        );
    }

    function renderChildren(node: StateTreeNode, indentCount: number) {
        const priorityChild = node.children.at(0);
        if (!priorityChild) return;

        const nodeGroup = nodeGroupOf(node);
        const groupIndentCount = nodeGroup?.indentCount || 0;

        // If the priority child is a black move and white move doesn't
        // have variations, and the white move is alone in its group,
        // you can merge this black move with the white move's group
        if (
            priorityChild.state.moveColour == PieceColour.BLACK
            && nodeGroup?.nodes.length == 1
            && !node.hasVariations()
        ) {
            nodeGroup.nodes.push(priorityChild);
        } else {
            nodeGroups.push({
                indentCount: indentCount
                    + +(priorityChild.hasVariations() && !node.mainline),
                nodes: [priorityChild]
            });
        }

        // If priority child is mainline or is merged with its parent node group,
        // the children of the priority node should be rendered after all of its
        // variations and their children. If not, you're in a state of just listing
        // variations.
        const priorityRenderLast = nodeGroupOf(priorityChild) == nodeGroupOf(node)
            || priorityChild.mainline;

        if (!priorityRenderLast) {
            renderChildren(priorityChild, groupIndentCount + 1);
        }

        for (const child of node.children.slice(1)) {
            const childIndentCount = Math.min(indentCount + 1, groupIndentCount + 1);

            nodeGroups.push({
                indentCount: childIndentCount,
                nodes: [child]
            });

            renderChildren(child, childIndentCount);
        }

        if (priorityRenderLast) {
            renderChildren(priorityChild, groupIndentCount);
        }
    }

    renderChildren(rootNode, 0);

    return nodeGroups.map(
        group => <LineGroup {...group} />
    );
}

export default generateTreeView;