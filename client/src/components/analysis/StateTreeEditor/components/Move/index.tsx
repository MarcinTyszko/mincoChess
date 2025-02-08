import React, { useContext } from "react";

import ContextMenu from "@components/common/ContextMenu";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useEvents from "@hooks/useEvents";
import EventType from "@constants/EventType";
import useContextMenu from "@hooks/useContextMenu";

import MoveClickEventContext from "../../MoveClickEventContext";
import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";

function Move({ node, children }: MoveProps) {
    const onMoveClick = useContext(MoveClickEventContext);

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisGameStore();

    const { dispatchEvent } = useEvents();

    const {
        contextMenuPosition,
        openContextMenu
    } = useContextMenu();

    function deleteNode() {
        if (!node?.parent) return;

        // Remove this node
        const siblings = node.parent.children;

        siblings.splice(
            siblings.indexOf(node),
            1
        );

        // If deleted node was mainline, promote first sibling
        if (node.mainline && siblings.length > 0) {
            siblings[0].mainlinePromote();
        }

        // Select the parent node
        setCurrentStateTreeNode(node.parent);

        dispatchEvent(EventType.STATE_TREE_UPDATE);
    }

    function promoteNode() {
        throw new Error("not implemented yet.");
    }

    return <>
        <span
            className={
                styles.wrapper
                + ` ${currentStateTreeNode == node && styles.current}`
            }
            onClick={() => {
                if (node) onMoveClick?.(node);
            }}
            onContextMenu={openContextMenu}
        >
            {node?.state.move?.san || children || "?"}
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
                    },
                    {
                        icon: require("@assets/img/help.svg"),
                        label: "Log state tree node",
                        onSelect: () => console.log(node)
                    }
                ]}
            />
        }
    </>;
}

export default Move;