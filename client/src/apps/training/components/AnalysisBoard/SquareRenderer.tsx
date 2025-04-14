import React, { forwardRef, useMemo, useRef } from "react";
import {
    CustomSquareProps,
    CustomSquareRenderer
} from "react-chessboard/dist/chessboard/types";
import { useShallow } from "zustand/react/shallow";

import { parseUciMove } from "wintrchess";
import {
    classificationColours,
    classificationImages
} from "@constants/classifications";
import useSettingsStore from "@stores/SettingsStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";

import * as styles from "./AnalysisBoard.module.css";

function useSquareRenderer() {
    return forwardRef<HTMLDivElement, CustomSquareProps>(
        ({ style, children, square }, ref) => {
            const classificationsHidden = useSettingsStore(
                state => state.settings.analysis.hideClassifications
            );

            const { currentStateTreeNode } = useAnalysisBoardStore();
    
            const {
                playableSquares,
                capturableSquares,
                highlightedSquares
            } = useAnalysisBoardStore(
                useShallow(state => ({
                    playableSquares: state.playableSquares,
                    capturableSquares: state.capturableSquares,
                    highlightedSquares: state.highlightedSquares
                }))
            );
    
            const playedMove = useMemo(() => {
                if (!currentStateTreeNode.state.move) return;
    
                return parseUciMove(currentStateTreeNode.state.move.uci);
            }, [currentStateTreeNode]);

            const squareRef = useRef<HTMLDivElement | null>(null);

            const classification = currentStateTreeNode.state.classification;

            const classificationColour = (
                classification != undefined && !classificationsHidden
            ) ? classificationColours[classification] : "#ffff33";
        
            return <div
                style={{ ...style, position: "relative" }}
                ref={element => {
                    if (typeof ref == "function") {
                        ref(element);
                    } else if (ref) {
                        ref.current = element;
                    }

                    squareRef.current = element;
                }}
            >
                {children}
    
                {/* Played move highlight */}
                {
                    (square == playedMove?.from || square == playedMove?.to)
                    && <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: classificationColour,
                            opacity: 0.5
                        }}
                    />
                }

                {/* Playable Square Circle */}
                {
                    playableSquares.includes(square)
                    && <div
                        className={
                            capturableSquares.includes(square)
                                ? styles.capturableMoveCircle
                                : styles.playableMoveCircle
                        }
                        style={{
                            borderWidth: 0.1 * (squareRef.current?.clientWidth || 0)
                        }}
                    />
                }
                
                {/* Selected square highlight */}
                {
                    highlightedSquares.includes(square)
                    && <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#eb6150",
                            opacity: 0.8
                        }}
                    />
                }

                {/* Classification icon */}
                {
                    classification != undefined
                    && square == playedMove?.to
                    && !classificationsHidden
                    && <img
                        src={classificationImages[classification]}
                        style={{
                            position: "absolute",
                            right: "-15%",
                            top: "-15%",
                            width: "45%",
                            height: "45%",
                            zIndex: 6
                        }}
                    />
                }
            </div>;
        }
    ) as CustomSquareRenderer;
}

export default useSquareRenderer;