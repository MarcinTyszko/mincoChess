import React, { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Arrow, Piece, Square } from "react-chessboard/dist/chessboard/types";

import {
    STARTING_FEN,
    parseUciMove,
    getTopEngineLine,
    addChildMove
} from "wintrchess";
import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useBoardSquaresStore from "@stores/BoardSquaresStore";
import playBoardSound from "@lib/boardSounds";
import PlayerProfile from "../PlayerProfile";

import useSquareRenderer from "./SquareRenderer";
import EvaluationBarArea from "./EvaluationBarArea";
import AnalysisBoardProps from "./AnalysisBoardProps";
import * as styles from "./AnalysisBoard.module.css";

function AnalysisBoard({
    topProfile,
    bottomProfile,
    style
}: AnalysisBoardProps) {
    const squareRenderer = useSquareRenderer();
    
    const { settings } = useSettingsStore();

    const { setAnalysisBoardWidth } = useLayoutStore();

    const { setGameAnalysisOpen } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        boardFlipped
    } = useAnalysisBoardStore();

    const {
        setPlayableSquares,
        setHighlightedSquares
    } = useBoardSquaresStore(
        useShallow(state => ({
            setPlayableSquares: state.setPlayableSquares,
            highlightedSquares: state.highlightedSquares,
            setHighlightedSquares: state.setHighlightedSquares
        }))
    );

    const [ userArrows, setUserArrows ] = useState<Arrow[]>([]);
    const [ suggestionArrows, setSuggestionArrows ] = useState<Arrow[]>([]);

    const [ position, setPosition ] = useState(STARTING_FEN);

    const selectedSquareRef = useRef<Square>();

    useEffect(() => {
        setPosition(currentStateTreeNode.state.fen);

        setHighlightedSquares([]);
        setUserArrows([]);
        setSuggestionArrows([]);
    }, [currentStateTreeNode]);

    useEffect(() => {
        if (!settings.analysis.suggestionArrows) {
            return setSuggestionArrows([]);
        }

        const topLine = getTopEngineLine(currentStateTreeNode.state);
        if (!topLine?.moves.length) return;

        const uciMove = parseUciMove(topLine.moves[0].uci);

        setSuggestionArrows([
            [
                uciMove.from,
                uciMove.to,
                "#98bc49"
            ] as Arrow
        ]);
    }, [
        currentStateTreeNode,
        settings.analysis.suggestionArrows
    ]);

    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardRef.current) return;

        const boardResizeObserver = new ResizeObserver(entries => {
            setAnalysisBoardWidth(entries[0].target.clientWidth);
        });

        boardResizeObserver.observe(boardRef.current);
    }, []);

    const generatePlayableSquares = useCallback(
        (square: Square) => (
            new Chess(currentStateTreeNode.state.fen)
                .moves({ square, verbose: true })
                .map(move => move.to)
        ), [currentStateTreeNode]
    );

    function handleSquareClick(square: Square, piece?: Piece) {
        setHighlightedSquares([]);
        setUserArrows([]);

        const playableSquares = useBoardSquaresStore.getState().playableSquares;

        if (playableSquares.includes(square) && selectedSquareRef.current) { 
            addMove(selectedSquareRef.current, square, piece);

            setPlayableSquares([]);
            selectedSquareRef.current = undefined;

            return;
        }

        if (piece && selectedSquareRef.current != square) {
            setPlayableSquares(generatePlayableSquares(square));
            selectedSquareRef.current = square;
        } else {
            setPlayableSquares([]);
            selectedSquareRef.current = undefined;
        }
    }

    function toggleSquareHighlight(square: Square) {
        setHighlightedSquares(prev => (
            prev.includes(square)
                ? prev.filter(
                    highlightedSquare => highlightedSquare != square
                )
                : [ ...prev, square ]
        ));
    }

    function addMove(source: Square, target: Square, piece?: Piece) {
        setHighlightedSquares([]);

        // Validate that move is legal
        const validationBoard = new Chess(currentStateTreeNode.state.fen);

        try {
            var move = validationBoard.move({
                from: source,
                to: target,
                promotion: piece?.at(1)?.toLowerCase() || "q"
            });
        } catch {
            return false;
        }

        // Add a new node to state tree
        const addedNode = addChildMove(currentStateTreeNode, move.san);

        setCurrentStateTreeNode(addedNode);
        playBoardSound(addedNode);

        setGameAnalysisOpen(true);

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
            <EvaluationBarArea/>

            <div className={styles.board} ref={boardRef}>
                <Chessboard
                    position={position}
                    onSquareClick={handleSquareClick}
                    onSquareRightClick={toggleSquareHighlight}
                    onPieceDragBegin={(piece, square) => {
                        setPlayableSquares(generatePlayableSquares(square));
                        selectedSquareRef.current = square;
                    }}
                    onPieceDragEnd={() => {
                        setPlayableSquares([]);
                        selectedSquareRef.current = undefined;
                    }}
                    onPieceDrop={addMove}
                    onArrowsChange={newUserArrows => {
                        if (newUserArrows.length == 0) return;

                        setUserArrows(prev => [ ...prev, ...newUserArrows ]);
                    }}
                    customSquare={squareRenderer}
                    customArrows={[ ...userArrows, ...suggestionArrows ]}
                    promotionDialogVariant="vertical"
                    animationDuration={200}
                    boardOrientation={
                        boardFlipped ? "black" : "white"
                    }
                />
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