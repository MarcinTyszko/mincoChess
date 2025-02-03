import React, { useMemo } from "react";

import { PieceColour } from "wintrchess";
import Indent from "../Indent";
import Text from "../Text";

import LineGroupProps from "./LineGroupProps";
import * as styles from "./LineGroup.module.css";

function LineGroup({ node, forceWhiteMoveNumber, children }: LineGroupProps) {
    const moveNumber = useMemo(() => node.moveNumber(), []);
    const variationDepth = useMemo(() => node.variationDepth(), []);

    return <div className={styles.wrapper}>
        {
            Array(variationDepth).fill(
                <Indent/>
            )
        }

        <Text>
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