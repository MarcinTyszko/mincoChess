import React, { forwardRef, useContext, useMemo } from "react";
import { CustomSquareProps, CustomSquareRenderer } from "react-chessboard/dist/chessboard/types";

import { Classification, parseUciMove } from "wintrchess";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";

import HighlightedSquaresContext from "./HighlightedSquaresContext";

const classificationImages: Record<Classification, any> = {
    [Classification.BRILLIANT]: require("@assets/img/classifications/brilliant.png"),
    [Classification.ONLY]: require("@assets/img/classifications/brilliant.png"),
    [Classification.BEST]: require("@assets/img/classifications/best.png"),
    [Classification.EXCELLENT]: require("@assets/img/classifications/excellent.png"),
    [Classification.OKAY]: require("@assets/img/classifications/okay.png"),
    [Classification.INACCURACY]: require("@assets/img/classifications/inaccuracy.png"),
    [Classification.MISTAKE]: require("@assets/img/classifications/mistake.png"),
    [Classification.BLUNDER]: require("@assets/img/classifications/blunder.png"),
    [Classification.FORCED]: require("@assets/img/classifications/forced.png"),
    [Classification.THEORY]: require("@assets/img/classifications/theory.png"),
    [Classification.RISKY]: require("@assets/img/classifications/risky.png")
};

const classificationColours: Record<Classification, string> = {
    [Classification.BRILLIANT]: "#1baaa6",
    [Classification.ONLY]: "#5b8baf",
    [Classification.BEST]: "#98bc49",
    [Classification.EXCELLENT]: "#98bc49",
    [Classification.OKAY]: "#97af8b",
    [Classification.INACCURACY]: "#f4bf44",
    [Classification.MISTAKE]: "#e28c28",
    [Classification.BLUNDER]: "#c93230",
    [Classification.FORCED]: "#97af8b",
    [Classification.THEORY]: "#a88764",
    [Classification.RISKY]: "#8983ac"
};

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