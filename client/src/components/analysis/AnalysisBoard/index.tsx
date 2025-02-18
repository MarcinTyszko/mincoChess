import React, { forwardRef, useContext, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
    CustomSquareProps,
    CustomSquareRenderer,
    Piece,
    Square
} from "react-chessboard/dist/chessboard/types";

import {
    PieceColour,
    STARTING_FEN,
    StateTreeNode,
    parseUciMove
} from "wintrchess";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import playBoardSound from "@lib/boardSounds";
import PlayerProfile from "../PlayerProfile";

import HighlightedSquaresContext from "./HighlightedSquaresContext";
import AnalysisBoardProps from "./AnalysisBoardProps";
import * as styles from "./AnalysisBoard.module.css";

function AnalysisBoard({
    topProfile,
    bottomProfile,
    style
}: AnalysisBoardProps) {
    const { setGameAnalysisOpen } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        boardFlipped
    } = useAnalysisBoardStore();

    const [
        highlightedSquares,
        setHighlightedSquares
    ] = useState<Square[]>([]);

    const squareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
        ({ style, children, square }, ref) => {
            const squareHighlights = useContext(HighlightedSquaresContext);

            const playedMove = useMemo(() => {
                if (!currentStateTreeNode.state.move) return;

                return parseUciMove(currentStateTreeNode.state.move.uci);
            }, [currentStateTreeNode]);
        
            return <div
                style={{ ...style, position: "relative" }}
                ref={ref}
            >
                {children}

                {
                    (square == playedMove?.from || square == playedMove?.to)
                    && <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ffff33",
                            opacity: 0.5
                        }}
                    />
                }
                
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
            </div>;
        }
    ) as CustomSquareRenderer;

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

        const createdNode = new StateTreeNode({
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

        if (!existingNode) {
            currentStateTreeNode.children.push(createdNode);
        }

        setCurrentStateTreeNode(existingNode || createdNode);

        setGameAnalysisOpen(true);

        playBoardSound(createdNode);

        return true;
    }

    return <div
        className={styles.wrapper}
        style={style}
    >
        <PlayerProfile
            profile={
                boardFlipped ? bottomProfile : topProfile
            }
        />

        <div className={styles.boardContainer}>
            <div className={styles.evaluationBar}>
                poop
            </div>

            <div className={styles.board}>
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
                        animationDuration={200}
                        boardOrientation={
                            boardFlipped ? "black" : "white"
                        }
                    />
                </HighlightedSquaresContext.Provider>
            </div>
        </div>

        <PlayerProfile
            profile={
                boardFlipped ? topProfile : bottomProfile
            }
            bottom
        />
    </div>;
}

export default AnalysisBoard;