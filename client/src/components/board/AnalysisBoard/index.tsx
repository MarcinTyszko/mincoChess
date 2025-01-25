import React, { useContext, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
    CustomSquareRenderer,
    Piece,
    Square
} from "react-chessboard/dist/chessboard/types";

import HighlightedSquaresContext from "./HighlightedSquaresContext";
import PlayerProfile from "../PlayerProfile";

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
    const [ board, setBoard ] = useState(new Chess());

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

        // let move: Move;

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
                <HighlightedSquaresContext.Provider
                    value={highlightedSquares}
                >
                    <Chessboard
                        position={board.fen()}
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