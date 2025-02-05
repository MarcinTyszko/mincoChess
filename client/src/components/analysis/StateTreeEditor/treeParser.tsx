import React, { ReactNode } from "react";
import { minBy } from "lodash";

import { PieceColour, StateTreeNode } from "wintrchess";
import LineGroup from "./components/LineGroup";
import Text from "./components/Text";
import Move from "./components/Move";

function renderNode(node: StateTreeNode) {
    if (!node.parent) return;

    const parentNode = node.parent;
    const grandparentNode = parentNode.parent;

    if (node.state.moveColour == PieceColour.WHITE) {
        // If white and black move in pair have variations
        if (
            parentNode.children.length > 1
            && node.children.length > 1
        ) {
            // If it is in the mainline, split nodes into two line groups
            if (node.mainline) return (
                <LineGroup node={node}>     
                    <Move stateTreeNode={node}/>

                    <Text>
                        ...
                    </Text>
                </LineGroup>
            );
        } else {
            const priorityChildNode = node.children.find(child => child.mainline)
                || node.children.at(0);

            return <LineGroup node={node}>      
                <Move stateTreeNode={node}/>

                {
                    priorityChildNode
                    && <Move stateTreeNode={priorityChildNode}/>
                }
            </LineGroup>;
        }
    } else {
        // If there is a grandparent node, check if both moves
        // have variations. If not, the parent must be the root
        // node, so "... e5" must be used regardless.
        if (
            grandparentNode
                ? (
                    parentNode.children.length > 1
                    && grandparentNode.children.length > 1
                )
                : true
        ) {
            // Render the second half of a move pair split
            if (node.mainline) return (
                <LineGroup node={node} forceWhiteMoveNumber>
                    <Text>
                        ...
                    </Text>
            
                    <Move stateTreeNode={node}/>
                </LineGroup>
            );
        } else {
            // If this is not part of a move pair split, render
            // nothing since it's merged with the last line group,
            // unless this node has a different variation depth than
            // the white move (its parent).
            const priorityChildNode = parentNode.children[0];

            if (
                parentNode.variationDepth() == node.variationDepth()
                || priorityChildNode == node
            ) return <></>;
        }
    }

    return <LineGroup node={node}>
        <Move stateTreeNode={node}/>
    </LineGroup>;
}

function generateTreeView(rootNode: StateTreeNode) {
    const lineGroups: ReactNode[] = [];

    function generateTreeViewLayer(parentNode: StateTreeNode) {
        if (parentNode.children.length == 0) return;

        // Manually render node with lowest variation depth first
        const priorityNode = minBy(
            parentNode.children,
            child => child.variationDepth()
        );

        if (priorityNode) {
            lineGroups.push(renderNode(priorityNode));

            // Recursively render rest of the nodes
            const remainingNodes = parentNode.children.filter(
                child => child != priorityNode
            );

            for (const node of remainingNodes) {
                lineGroups.push(renderNode(node));
        
                generateTreeViewLayer(node);
            }

            // Recursively render the priority node, going to next moves on
            // the priority line.
            generateTreeViewLayer(priorityNode);
        } else {
            // Recursively render child nodes
            for (const node of parentNode.children) {
                lineGroups.push(renderNode(node));
        
                generateTreeViewLayer(node);
            }
        }
    }

    generateTreeViewLayer(rootNode);

    return <div>
        {lineGroups}
    </div>;
}

export default generateTreeView;