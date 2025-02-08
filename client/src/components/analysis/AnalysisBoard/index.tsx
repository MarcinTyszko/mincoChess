import React, { forwardRef, useContext, useEffect, useState } from "react";
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
    StateTreeNode
} from "wintrchess";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import PlayerProfile from "../PlayerProfile";

import HighlightedSquaresContext from "./HighlightedSquaresContext";
import AnalysisBoardProps from "./AnalysisBoardProps";
import * as styles from "./AnalysisBoard.module.css";

const moveSounds = {
    move: require("@assets/audio/move.mp3"),
    check: require("@assets/audio/check.mp3"),
    capture: require("@assets/audio/capture.mp3"),
    castle: require("@assets/audio/castle.mp3"),
    promote: require("@assets/audio/promote.mp3"),
    gameEnd: require("@assets/audio/gameend.mp3")
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

    const [ highlightedSquares, setHighlightedSquares ] = useState<Square[]>([]);

    const squareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
        ({ style, children, square }, ref) => {
            const squareHighlights = useContext(HighlightedSquaresContext);
        
            return <div
                style={{ ...style, position: "relative" }}
                ref={ref}
            >
                {children}
                
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

    useEffect(() => {
        const move = currentStateTreeNode.state.move;
        const fen = currentStateTreeNode.state.fen;

        if (!move) return;

        const board = new Chess(fen);

        if (board.isGameOver()) {
            new Audio(moveSounds.gameEnd).play();
        }

        if (board.isCheck()) {
            new Audio(moveSounds.check).play();
        } else if (move.san.includes("O")) {
            new Audio(moveSounds.castle).play();
        } else if (move.san.includes("=")) {
            new Audio(moveSounds.promote).play();
        } else if (move.san.includes("x")) {
            new Audio(moveSounds.capture).play();
        } else {
            new Audio(moveSounds.move).play();
        }
    }, [currentStateTreeNode]);

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

        return true;
    }

    return <div
        className={styles.wrapper}
        style={style}
    >
        {
            topProfile
            && <PlayerProfile profile={topProfile} />
        }

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