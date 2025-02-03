import React from "react";

import Indent from "../Indent";
import Text from "../Text";

import LineGroupProps from "./LineGroupProps";
import * as styles from "./LineGroup.module.css";

function LineGroup({ node, forceWhiteMoveNumber, children }: LineGroupProps) {
    const moveNumber = node.moveNumber();

    return <div className={styles.wrapper}>
        {
            Array(node.variationDepth()).fill(
                <Indent/>
            )
        }

        <Text>
            {Math.trunc(moveNumber) + 1}
            {
                forceWhiteMoveNumber
                    ? "."
                    : (moveNumber % 1 == 0 ? "." : "...")
            }
        </Text>

        {children}
    </div>;
}

export default LineGroup;