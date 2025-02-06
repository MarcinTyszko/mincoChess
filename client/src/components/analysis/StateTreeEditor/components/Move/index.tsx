import React, { useContext, useState } from "react";

import ContextMenu from "@components/common/ContextMenu";
import { ContextMenuPosition } from "@components/common/ContextMenu/types";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useEvents from "@hooks/useEvents";
import EventType from "@constants/EventType";

import MoveClickEventContext from "../../MoveClickEventContext";
import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";

function Move({ stateTreeNode, children }: MoveProps) {
    const onMoveClick = useContext(MoveClickEventContext);

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisGameStore();

    const { dispatchEvent } = useEvents();

    const [ contextMenuPosition, setContextMenuPosition ] = useState<ContextMenuPosition>();

    function deleteNode() {
        if (!stateTreeNode?.parent) return;

        const siblings = stateTreeNode.parent.children;

        siblings.splice(
            siblings.indexOf(stateTreeNode),
            1
        );

        setCurrentStateTreeNode(stateTreeNode.parent);

        dispatchEvent(EventType.STATE_TREE_UPDATE);
    }

    function promoteNode() {
        if (!stateTreeNode?.parent) return;

        // Find the closest node of a lower variation depth
        let closestShallowerNode = stateTreeNode;

        while (closestShallowerNode.parent) {
            closestShallowerNode = closestShallowerNode.parent;

            if (closestShallowerNode.variationDepth() < stateTreeNode.variationDepth()) {
                break;
            }
        }

        const closestShallowerSiblings = closestShallowerNode.parent?.children;
        if (!closestShallowerSiblings) return;

        // If there is a mainline sibling, overthrow it
        const siblings = stateTreeNode.parent.children;

        const mainlineSibling = siblings.find(child => child.mainline);

        if (mainlineSibling) {
            mainlineSibling.mainline = false;
            stateTreeNode.mainline = true;
        }

        // Put this node at the beginning of the closest shallower node's siblings
        siblings.splice(
            siblings.indexOf(stateTreeNode),
            1
        );

        closestShallowerSiblings.unshift(stateTreeNode);
    }

    return <>
        <span
            className={
                styles.wrapper
                + ` ${currentStateTreeNode == stateTreeNode && styles.current}`
            }
            onClick={() => {
                if (stateTreeNode) onMoveClick?.(stateTreeNode);
            }}
            onContextMenu={event => {
                event.preventDefault();

                setContextMenuPosition({
                    x: event.pageX,
                    y: event.pageY
                });

                const onClick = () => {
                    setContextMenuPosition(undefined);
                    removeEventListener("click", onClick);
                };

                addEventListener("click", onClick);
            }}
        >
            {stateTreeNode?.state.move?.san || children || "?"}
        </span>

        {
            contextMenuPosition
            && <ContextMenu
                position={contextMenuPosition}
                options={[
                    {
                        icon: require("@assets/img/delete.svg"),
                        label: "Delete move",
                        onSelect: deleteNode
                    },
                    {
                        icon: require("@assets/img/up.svg"),
                        label: "Promote move",
                        onSelect: promoteNode
                    }
                ]}
            />
        }
    </>;
}

export default Move;