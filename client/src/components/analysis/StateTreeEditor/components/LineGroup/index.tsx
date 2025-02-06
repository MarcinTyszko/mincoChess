import React from "react";

import { PieceColour } from "wintrchess";
import Indent from "../Indent";
import Text from "../Text";

import LineGroupProps from "./LineGroupProps";
import * as styles from "./LineGroup.module.css";

function LineGroup({ node, forceWhiteMoveNumber, children }: LineGroupProps) {
    const moveNumber = node.moveNumber();
    const variationDepth = node.variationDepth();

    return <div className={styles.wrapper}>
        {
            Array(variationDepth).fill(
                <Indent style={{
                    position: "absolute",
                    top: "-2px"
                }}/>
            )
        }

        <Text
            style={{
                marginLeft: variationDepth > 0
                    ? "15px"
                    : "0px"
            }}
        >
            {Math.trunc(moveNumber) + 1}
            
            {
                forceWhiteMoveNumber || node.state.moveColour == PieceColour.WHITE
                    ? "."
                    : "..."
            }
        </Text>

        {children}
    </div>;
}

export default LineGroup;