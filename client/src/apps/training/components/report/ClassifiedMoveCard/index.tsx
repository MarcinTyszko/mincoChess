import React from "react";
import { useTranslation } from "react-i18next";
import { Chess } from "chess.js";

import {
    StateTreeNode,
    Classification,
    addChildMove,
    findNodeRecursively,
    getSimpleNotation,
    getTopEngineLine
} from "wintrchess";
import {
    classificationColours,
    classificationImages,
    loadingClassificationIcon,
    errorClassificationIcon,
    inalterableClassifications
} from "@constants/classifications";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@apps/training/stores/AnalysisProgressStore";
import ErrorMessage from "@components/common/ErrorMessage";
import playBoardSound from "@lib/boardSounds";

import * as styles from "./ClassifiedMoveCard.module.css";

function getPlayedMove(currentNode: StateTreeNode) {
    if (!currentNode.parent) return;
    if (!currentNode.state.move) return;

    const previousBoard = new Chess(currentNode.parent.state.fen);

    return previousBoard.move(currentNode.state.move.san);
}

function ClassifiedMoveCard() {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();

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

    const nearestOpeningName = findNodeRecursively(
        node,
        searchNode => !!searchNode.state.opening,
        true
    )?.state.opening;

    const playedMove = getPlayedMove(node);

    return <div className={styles.wrapper}>
        <div
            className={styles.classificationSection}
            style={nearestOpeningName
                ? { borderRadius: "10px 10px 0 0" }
                : undefined
            }
        >
            <div className={styles.classification}>
                <img src={node.state.classification != undefined
                    ? classificationImages[node.state.classification]
                    : (realtimeClassifyError
                        ? errorClassificationIcon
                        : loadingClassificationIcon
                    )
                }/>

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
                            (settings.analysis.simpleNotation && playedMove
                                ? getSimpleNotation(playedMove)
                                : node.state.move?.san
                            )
                            + " "
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

            {realtimeClassifyError
                && <ErrorMessage style={{ marginTop: "5px" }}>
                    {realtimeClassifyError}
                </ErrorMessage>
            }

            {
                bestAlternativeMove
                && node.state.classification != undefined
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
        </div>

        {
            nearestOpeningName
            && <div className={styles.opening}>
                {nearestOpeningName}
            </div>
        }
    </div>;
}

export default ClassifiedMoveCard;