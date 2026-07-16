import React, { useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import {
    CustomSquareStyles,
    Square
} from "react-chessboard/dist/chessboard/types";
import { Chess } from "chess.js";

import useResizeObserver from "@/hooks/useResizeObserver";
import useSettingsStore from "@/stores/SettingsStore";

import * as styles from "./LearningBoard.module.css";

export interface LearningBoardProps {
    fen: string;
    flipped?: boolean;
    interactive?: boolean;
    highlightedSquares?: Partial<Record<Square, string>>;
    arrows?: [Square, Square][];
    onMove?: (from: Square, to: Square) => boolean;
}

const SELECTED_SQUARE_COLOUR = "rgba(255, 255, 100, 0.4)";

function LearningBoard({
    fen,
    flipped,
    interactive = true,
    highlightedSquares,
    arrows,
    onMove
}: LearningBoardProps) {
    const theme = useSettingsStore(state => state.settings.themes);

    const [ selectedSquare, setSelectedSquare ] = useState<Square>();

    const boardContainerRef = useRef<HTMLDivElement | null>(null);
    const { fullWidth: boardWidth } = useResizeObserver(boardContainerRef, 1);

    const squareStyles = useMemo(() => {
        const squareStyles: CustomSquareStyles = {};

        for (const [square, colour] of Object.entries(
            highlightedSquares || {}
        )) {
            squareStyles[square as Square] = { backgroundColor: colour };
        }

        if (selectedSquare) {
            squareStyles[selectedSquare] = {
                backgroundColor: SELECTED_SQUARE_COLOUR
            };
        }

        return squareStyles;
    }, [highlightedSquares, selectedSquare]);

    function playMove(from: Square, to: Square) {
        setSelectedSquare(undefined);

        return onMove?.(from, to) || false;
    }

    function onSquareClick(square: Square) {
        if (!interactive) return;

        if (selectedSquare && selectedSquare != square) {
            const legalMove = new Chess(fen)
                .moves({ square: selectedSquare, verbose: true })
                .some(move => move.to == square);

            if (legalMove) {
                playMove(selectedSquare, square);
                return;
            }
        }

        const piece = new Chess(fen).get(square);

        setSelectedSquare(
            piece && square != selectedSquare ? square : undefined
        );
    }

    return <div className={styles.boardContainer} ref={boardContainerRef}>
        <Chessboard
            position={fen}
            boardOrientation={flipped ? "black" : "white"}
            arePiecesDraggable={interactive}
            onPieceDrop={(from, to) => playMove(from, to)}
            onSquareClick={onSquareClick}
            customSquareStyles={squareStyles}
            customArrows={arrows}
            customLightSquareStyle={theme.board.lightSquareColour
                ? { backgroundColor: theme.board.lightSquareColour }
                : undefined
            }
            customDarkSquareStyle={theme.board.darkSquareColour
                ? { backgroundColor: theme.board.darkSquareColour }
                : undefined
            }
            animationDuration={165}
            autoPromoteToQueen
            boardWidth={boardWidth}
        />
    </div>;
}

export default LearningBoard;
