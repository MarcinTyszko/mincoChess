import React from "react";
import { useTranslation } from "react-i18next";

import {
    Classification,
    addChildMove,
    getTopEngineLine
} from "wintrchess";
import {
    classificationColours,
    classificationImages,
    inalterableClassifications
} from "@constants/classifications";
import playBoardSound from "@lib/boardSounds";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";

import * as styles from "./ClassifiedMoveCard.module.css";

const classificationTitles = {
    [Classification.BRILLIANT]: "brilliant",
    [Classification.ONLY]: "the only good move",
    [Classification.BEST]: "the best move",
    [Classification.EXCELLENT]: "excellent",
    [Classification.OKAY]: "an okay move",
    [Classification.INACCURACY]: "an inaccuracy",
    [Classification.MISTAKE]: "a mistake",
    [Classification.BLUNDER]: "a blunder",
    [Classification.FORCED]: "forced",
    [Classification.THEORY]: "theory",
    [Classification.RISKY]: "a risky idea"
};

function ClassifiedMoveCard() {
    const { t } = useTranslation();

    const {
        currentStateTreeNode: node,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore();

    const bestAlternativeMove = node.parent
        ? getTopEngineLine(node.parent.state)?.moves.at(0)
        : undefined;

    return <div className={styles.wrapper}>
        <div className={styles.classification}>
            {
                node.state.classification != undefined
                && <img
                    src={classificationImages[node.state.classification]}
                    width={30}
                    height={30}
                />
            }

            <span
                className={styles.classificationName}
                style={{
                    color: node.state.classification != undefined
                        ? classificationColours[node.state.classification]
                        : "white"
                }}
            >
                {
                    node.state.classification != undefined
                        ? (
                            `${node.state.move?.san} is `
                            + classificationTitles[node.state.classification]
                        )
                        : t("loading")
                }
            </span>
        </div>

        {
            bestAlternativeMove && node.state.classification != undefined
            && bestAlternativeMove.san != node.state.move?.san
            && !inalterableClassifications.includes(node.state.classification)
            && <span className={styles.bestAlternativeComment}>
                <span>The best move was</span>

                <span
                    className={styles.bestAlternativeMove}
                    onClick={() => {
                        if (!node.parent) return;

                        const createdNode = addChildMove(node.parent, bestAlternativeMove.san);

                        setCurrentStateTreeNode(createdNode);
                        playBoardSound(createdNode);
                    }}
                >
                    {bestAlternativeMove.san}
                </span>
            </span>
        }
    </div>;
}

export default ClassifiedMoveCard;