import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
    CustomSquareRenderer,
    Piece,
    Square
} from "react-chessboard/dist/chessboard/types";

import useChessBoardStore from "@stores/ChessBoardStore";
import useLoadedGameStore from "@stores/LoadedGameStore";
import PlayerProfile from "../PlayerProfile";

import ChessBoardProps from "./ChessBoardProps";
import * as styles from "./ChessBoard.module.css";

const squareRenderer: CustomSquareRenderer = ({
    children,
    style,
    square
}) => {
    const { highlightedSquares } = useChessBoardStore();

    return <div style={{ ...style, position: "relative" }}>
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
            ></div>
        }

        {children}
    </div>;
};

function ChessBoard({
    topProfile,
    bottomProfile,
    style
}: ChessBoardProps) {
    const {
        highlightedSquares,
        addSquareHighlight,
        removeSquareHighlight,
        clearSquareHighlights
    } = useChessBoardStore();

    const {
        loadedMoveTree,
        moveTreeCursor
    } = useLoadedGameStore();

    const [ board, setBoard ] = useState(new Chess());

    function highlightSquare(square: Square) {
        if (highlightedSquares.includes(square)) {
            return removeSquareHighlight(square);
        }

        addSquareHighlight(square);
    }

    function addMove(source: Square, target: Square, piece: Piece) {
        clearSquareHighlights();

        try {
            board.move({
                from: source,
                to: target,
                promotion: piece[1]?.toLowerCase() || "q"
            });
        } catch {
            return false;
        }

        setBoard(board);

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
                <Chessboard
                    position={board.fen()}
                    onSquareClick={clearSquareHighlights}
                    onSquareRightClick={highlightSquare}
                    onPieceDrop={addMove}
                    customSquare={squareRenderer}
                    promotionDialogVariant="vertical"
                />
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

export default ChessBoard;