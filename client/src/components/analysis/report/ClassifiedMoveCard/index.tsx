import React from "react";
import { useTranslation } from "react-i18next";

import {
    addChildMove,
    Classification,
    getTopEngineLine
} from "wintrchess";
import {
    classificationColours,
    classificationImages,
    loadingClassificationIcon,
    errorClassificationIcon,
    inalterableClassifications
} from "@constants/classifications";
import playBoardSound from "@lib/boardSounds";
import useAnalysisBoardStore from "@stores/analysis/AnalysisBoardStore";
import useAnalysisProgressStore from "@stores/analysis/AnalysisProgressStore";
import ErrorMessage from "@components/common/ErrorMessage";

import * as styles from "./ClassifiedMoveCard.module.css";

function ClassifiedMoveCard() {
    const { t } = useTranslation();

    const {
        currentStateTreeNode: node,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore();

    const realtimeClassifyError = useAnalysisProgressStore(
        state => state.realtimeClassifyError
    );

    const bestAlternativeMove = node.parent
        ? getTopEngineLine(node.parent.state)?.moves.at(0)
        : undefined;

    return <div className={styles.wrapper}>
        <div className={styles.classification}>
            <img
                src={node.state.classification != undefined
                    ? classificationImages[node.state.classification]
                    : (realtimeClassifyError
                        ? errorClassificationIcon
                        : loadingClassificationIcon
                    )
                }
                width={30}
                height={30}
            />

            <span
                className={styles.classificationName}
                style={{
                    color: node.state.classification != undefined
                        ? classificationColours[node.state.classification]
                        : (realtimeClassifyError
                            ? classificationColours[Classification.BLUNDER]
                            : "white"
                        )
                }}
            >
                {node.state.classification != undefined
                    ? (
                        `${node.state.move?.san} `
                        + t(
                            "pages.analysis.classifiedMoveCard.classifications."
                            + node.state.classification
                        )
                    )
                    : (realtimeClassifyError
                        ? t("error") : t("loading")
                    )
                }
            </span>
        </div>

        {
            realtimeClassifyError
            && <ErrorMessage style={{ marginTop: "5px" }}>
                {realtimeClassifyError}
            </ErrorMessage>
        }

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