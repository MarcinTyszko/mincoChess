import React from "react";
import { sumBy } from "lodash";

import {
    Classification,
    PieceColour,
    StateTreeNode,
    getNodeChain
} from "wintrchess";
import {
    classifications,
    classificationImages,
    classificationNames,
    classificationColours
} from "@constants/classifications";

import ClassificationCountCardProps from "./ClassificationCountCardProps";
import * as styles from "./ClassificationCountCard.module.css";

const excludedClassifications = [
    Classification.FORCED,
    Classification.RISKY
];

function ClassificationCountCard({ analysisGame }: ClassificationCountCardProps) {
    const nodeChain = getNodeChain(analysisGame.stateTree);

    function getClassificationCount(
        chain: StateTreeNode[],
        colour: PieceColour,
        classification: Classification
    ) {
        return sumBy(
            chain,
            node => Number(
                node.state.moveColour == colour
                && node.state.classification == classification
            )
        );
    }

    return <div className={styles.wrapper}>
        <table className={styles.classificationTable}>
            <thead>
                <th/>
                <th className={styles.username}>
                    {analysisGame.players.white.username || "White"}
                </th>
                <th/>
                <th className={styles.username}>
                    {analysisGame.players.black.username || "Black"}
                </th>
            </thead>

            {classifications
                .filter(classif => !excludedClassifications.includes(classif))
                .map(classif => (
                    <tr style={{ color: classificationColours[classif] }}>
                        <td className={styles.classificationNameCell}>
                            {classificationNames[classif]}
                        </td>
    
                        <td className={styles.classificationCountCell}>
                            {getClassificationCount(nodeChain, PieceColour.WHITE, classif)}
                        </td>
    
                        <td>
                            <img
                                src={classificationImages[classif]}
                                width={25}
                                height={25}
                            />
                        </td>
    
                        <td className={styles.classificationCountCell}>
                            {getClassificationCount(nodeChain, PieceColour.BLACK, classif)}
                        </td>
                    </tr>
                ))
            }
        </table>
    </div>;
}

export default ClassificationCountCard;