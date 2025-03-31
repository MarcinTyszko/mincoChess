import React, { forwardRef, useContext, useMemo } from "react";
import {
    CustomSquareProps,
    CustomSquareRenderer
} from "react-chessboard/dist/chessboard/types";

import { parseUciMove } from "wintrchess";
import {
    classificationColours,
    classificationImages
} from "@constants/classifications";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";

import HighlightedSquaresContext from "./HighlightedSquaresContext";

function useSquareRenderer() {
    return forwardRef<HTMLDivElement, CustomSquareProps>(
        ({ style, children, square }, ref) => {
            const { currentStateTreeNode } = useAnalysisBoardStore();
    
            const squareHighlights = useContext(HighlightedSquaresContext);
    
            const playedMove = useMemo(() => {
                if (!currentStateTreeNode.state.move) return;
    
                return parseUciMove(currentStateTreeNode.state.move.uci);
            }, [currentStateTreeNode]);

            const classification = currentStateTreeNode.state.classification;

            const classificationColour = classification != undefined
                ? classificationColours[classification] : "#ffff33";
        
            return <div
                style={{ ...style, position: "relative" }}
                ref={ref}
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
                
                {/* Selected square highlight */}
                {
                    squareHighlights.includes(square)
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
                    classification != undefined && square == playedMove?.to
                    && <img
                        src={classificationImages[classification]}
                        style={{
                            position: "absolute",
                            right: "-25%",
                            top: "-25%",
                            width: "60%",
                            height: "60%",
                            zIndex: 6
                        }}
                    />
                }
            </div>;
        }
    ) as CustomSquareRenderer;
}

export default useSquareRenderer;