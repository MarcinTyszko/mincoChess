import React, { ReactNode } from "react";

import { PieceColour, StateTreeNode } from "wintrchess";
import LineGroup from "./components/LineGroup";
import Text from "./components/Text";
import Move from "./components/Move";

function renderNode(node: StateTreeNode) {
    if (!node.parent) return;

    const parentNode = node.parent;
    const grandparentNode = parentNode.parent;

    const priorityChildNode = node.children.find(child => child.mainline)
        || node.children.at(0);

    if (node.state.moveColour == PieceColour.WHITE) {
        // If white and black move in pair have variations
        if (
            parentNode.children.length > 1
            && node.children.length > 1
        ) {
            // If it is in the mainline, split nodes into two line groups
            if (node.mainline) return (
                <LineGroup node={node} forceWhiteMoveNumber>     
                    <Move state={node.state}/>

                    <Text>
                        ...
                    </Text>
                </LineGroup>
            );
        } else {
            return <LineGroup node={node}>      
                <Move state={node.state}/>

                {
                    priorityChildNode
                    && <Move state={priorityChildNode.state}/>
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
            
                    <Move state={node.state}/>
                </LineGroup>
            );
        } else {
            // If this is not part of a move pair split, render
            // nothing since it's merged with the last line group,
            // unless this node is a variation and the white move
            // is in the mainline. Non-mainline black move cannot
            // merge with a mainline white move.
            if (
                !(parentNode.mainline && !node.mainline)
            ) return <></>;
        }
    }

    return <LineGroup node={node}>
        <Move state={node.state}/>
    </LineGroup>;
}

function generateTreeView(rootNode: StateTreeNode) {
    const lineGroups: ReactNode[] = [];

    function generateTreeViewLayer(parentNode: StateTreeNode) {
        if (parentNode.children.length == 0) return;

        // Manually render mainline node first
        // If there is no mainline node, it can just be whatever's first
        const priorityNode = parentNode.children.find(child => child.mainline)
            || parentNode.children[0];

        lineGroups.push(renderNode(priorityNode));

        // Recursively render rest of the nodes
        for (const node of parentNode.children.slice(1)) {
            lineGroups.push(renderNode(node));
    
            generateTreeViewLayer(node);
        }

        // Recursively render the mainline node, going to next
        // mainline moves.
        generateTreeViewLayer(priorityNode);
    }

    generateTreeViewLayer(rootNode);

    return <div>
        {lineGroups}
    </div>;
}

export default generateTreeView;