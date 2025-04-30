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
import AnalysisTab from "@constants/AnalysisTab";
import useSettingsStore from "@stores/SettingsStore";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisTabStore from "@apps/training/stores/AnalysisTabStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import playBoardSound from "@lib/boardSounds";
import PlayerProfile from "../PlayerProfile";

import useSquareRenderer from "./SquareRenderer";
import EvaluationBarArea from "./EvaluationBarArea";
import AnalysisBoardProps from "./AnalysisBoardProps";
import * as styles from "./AnalysisBoard.module.css";

const profileBorderRadius = "7px";

function AnalysisBoard({
    topProfile,
    bottomProfile,
    style
}: AnalysisBoardProps) {
    const squareRenderer = useSquareRenderer();
    
    const { settings } = useSettingsStore();

    const { setAnalysisBoardWidth } = useLayoutStore();

    const {
        gameAnalysisOpen,
        setGameAnalysisOpen
    } = useAnalysisGameStore();

    const setActiveTab = useAnalysisTabStore(state => state.setActiveTab);

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        boardFlipped,
        setPlayableSquares,
        setCapturableSquares,
        setHighlightedSquares
    } = useAnalysisBoardStore(
        useShallow(state => ({
            currentStateTreeNode: state.currentStateTreeNode,
            setCurrentStateTreeNode: state.setCurrentStateTreeNode,
            boardFlipped: state.boardFlipped,
            setPlayableSquares: state.setPlayableSquares,
            setCapturableSquares: state.setCapturableSquares,
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

    const generatePlayableSquares = useCallback((square: Square) => {
        const legalMoves = new Chess(currentStateTreeNode.state.fen)
            .moves({ square, verbose: true });

        const playableSquares = legalMoves.map(move => move.to);
        const capturableSquares = legalMoves
            .filter(move => move.captured)
            .map(move => move.to);

        return {
            movable: playableSquares,
            capturable: capturableSquares
        };
    }, [currentStateTreeNode]);

    function handleSquareClick(square: Square, piece?: Piece) {
        setHighlightedSquares([]);
        setUserArrows([]);

        const playableSquares = useAnalysisBoardStore.getState().playableSquares;

        if (playableSquares.includes(square) && selectedSquareRef.current) { 
            addMove(selectedSquareRef.current, square, piece);

            setPlayableSquares([]);
            setCapturableSquares([]);
            selectedSquareRef.current = undefined;

            return;
        }

        if (piece && selectedSquareRef.current != square) {
            const playableSquares = generatePlayableSquares(square);

            setPlayableSquares(playableSquares.movable);
            setCapturableSquares(playableSquares.capturable);
            selectedSquareRef.current = square;
        } else {
            setPlayableSquares([]);
            setCapturableSquares([]);
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

        if (!gameAnalysisOpen) {
            setActiveTab(AnalysisTab.ANALYSIS);
        }

        setGameAnalysisOpen(true);

        return true;
    }

    return <div
        className={styles.wrapper}
        style={style}
    >
        <div 
            className={styles.playerProfile}
            style={{
                borderTopLeftRadius: profileBorderRadius,
                borderTopRightRadius: profileBorderRadius
            }}
        >
            <PlayerProfile profile={
                boardFlipped ? bottomProfile : topProfile
            }/>
        </div>

        <div className={styles.boardContainer}>
            <EvaluationBarArea/>

            <div className={styles.board} ref={boardRef}>
                <Chessboard
                    position={position}
                    onSquareClick={handleSquareClick}
                    onSquareRightClick={toggleSquareHighlight}
                    onPieceDragBegin={(piece, square) => {
                        const playableSquares = generatePlayableSquares(square);

                        setPlayableSquares(playableSquares.movable);
                        setCapturableSquares(playableSquares.capturable);
                        selectedSquareRef.current = square;
                    }}
                    onPieceDragEnd={() => {
                        setPlayableSquares([]);
                        setCapturableSquares([]);
                        selectedSquareRef.current = undefined;
                    }}
                    onPieceDrop={addMove}
                    onArrowsChange={newUserArrows => {
                        if (newUserArrows.length == 0) return;

                        setUserArrows(prev => [ ...prev, ...newUserArrows ]);
                    }}
                    customLightSquareStyle={{
                        backgroundColor: settings.themes.board.lightSquareColour
                    }}
                    customDarkSquareStyle={{
                        backgroundColor: settings.themes.board.darkSquareColour
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

        <div 
            className={styles.playerProfile}
            style={{
                borderBottomLeftRadius: profileBorderRadius,
                borderBottomRightRadius: profileBorderRadius
            }}
        >
            <PlayerProfile profile={
                boardFlipped ? topProfile : bottomProfile
            }/>
        </div>
    </div>;
}

export default AnalysisBoard;