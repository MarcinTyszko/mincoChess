import React, { useContext, useState } from "react";

import ContextMenu from "@components/common/ContextMenu";
import { ContextMenuPosition } from "@components/common/ContextMenu/types";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useEvents from "@hooks/useEvents";
import EventType from "@constants/EventType";

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

    const [ contextMenuPosition, setContextMenuPosition ] = useState<ContextMenuPosition>();

    function deleteNode() {
        if (!node?.parent) return;

        const siblings = node.parent.children;

        siblings.splice(
            siblings.indexOf(node),
            1
        );

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