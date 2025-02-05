import React, { useContext, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
    CustomSquareRenderer,
    Piece,
    Square
} from "react-chessboard/dist/chessboard/types";

import { PieceColour, STARTING_FEN, StateTreeNode } from "wintrchess";
import useEvents from "@hooks/useEvents";
import EventType from "@constants/EventType";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import PlayerProfile from "../PlayerProfile";

import HighlightedSquaresContext from "./HighlightedSquaresContext";
import AnalysisBoardProps from "./AnalysisBoardProps";
import * as styles from "./AnalysisBoard.module.css";

const squareRenderer: CustomSquareRenderer = ({
    children,
    style,
    square
}) => {
    const squareHighlights = useContext(HighlightedSquaresContext);

    return <div style={{ ...style, position: "relative" }}>
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
            ></div>
        }

        {children}
    </div>;
};

function AnalysisBoard({
    topProfile,
    bottomProfile,
    style
}: AnalysisBoardProps) {
    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisGameStore();

    const { dispatchEvent } = useEvents();

    const [ highlightedSquares, setHighlightedSquares ] = useState<Square[]>([]);

    function toggleSquareHighlight(square: Square) {
        if (highlightedSquares.includes(square)) {
            const updatedSquares = highlightedSquares.filter(
                highlightedSquare => highlightedSquare != square
            );
    
            return setHighlightedSquares(updatedSquares);
        }

        setHighlightedSquares([ ...highlightedSquares, square ]);
    }

    function addMove(source: Square, target: Square, piece: Piece) {
        setHighlightedSquares([]);

        // Validate that move is legal
        const validationBoard = new Chess(currentStateTreeNode.state.fen);

        try {
            var move = validationBoard.move({
                from: source,
                to: target,
                promotion: piece[1]?.toLowerCase() || "q"
            });
        } catch {
            return false;
        }

        // Add a new node to state tree
        const existingNode = currentStateTreeNode.children.find(
            child => child.state.move?.san == move.san
        );

        let createdNode: StateTreeNode | undefined = undefined;

        if (!existingNode) {
            createdNode = new StateTreeNode({
                mainline: currentStateTreeNode.mainline
                    && !currentStateTreeNode.children.some(
                        child => child.mainline
                    ),
                parent: currentStateTreeNode,
                children: [],
                state: {
                    fen: move.after,
                    move: {
                        san: move.san,
                        uci: move.lan
                    },
                    moveColour: move.color == "w"
                        ? PieceColour.WHITE
                        : PieceColour.BLACK,
                    engineLines: {}
                }
            });

            currentStateTreeNode.children.push(createdNode);
        }

        setCurrentStateTreeNode(existingNode || createdNode);

        dispatchEvent(EventType.STATE_TREE_UPDATE);

        return true;
    }

    return <div className={styles.wrapper}>
        {
            topProfile
            && <PlayerProfile profile={topProfile} />
        }

        <div className={styles.boardContainer}>
            <div
                className={styles.evaluationBar}
                style={{ height: style?.width }}
            >
                <text>poop</text>
            </div>

            <div
                className={styles.board}
                style={style}
            >
                <HighlightedSquaresContext.Provider
                    value={highlightedSquares}
                >
                    <Chessboard
                        position={currentStateTreeNode?.state.fen || STARTING_FEN}
                        onSquareClick={() => setHighlightedSquares([])}
                        onSquareRightClick={toggleSquareHighlight}
                        onPieceDrop={addMove}
                        customSquare={squareRenderer}
                        promotionDialogVariant="vertical"
                    />
                </HighlightedSquaresContext.Provider>
            </div>
        </div>

        {
            bottomProfile
            && <PlayerProfile
                profile={bottomProfile}
                bottom
            />
        }
    </div>;
}

export default AnalysisBoard;