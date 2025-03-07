import React, {
    forwardRef,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
    Arrow,
    CustomSquareProps,
    CustomSquareRenderer,
    Piece,
    Square
} from "react-chessboard/dist/chessboard/types";

import { STARTING_FEN, parseUciMove } from "wintrchess";
import useLayoutStore from "@stores/LayoutStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import { getSettings } from "@lib/settings";
import playBoardSound from "@lib/boardSounds";
import PlayerProfile from "../PlayerProfile";

import HighlightedSquaresContext from "./HighlightedSquaresContext";
import EvaluationBarArea from "./EvaluationBarArea";
import AnalysisBoardProps from "./AnalysisBoardProps";
import * as styles from "./AnalysisBoard.module.css";

function AnalysisBoard({
    topProfile,
    bottomProfile,
    style
}: AnalysisBoardProps) {
    const { setAnalysisBoardWidth } = useLayoutStore();

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

    const [ userArrows, setUserArrows ] = useState<Arrow[]>([]);
    const [ suggestionArrows, setSuggestionArrows ] = useState<Arrow[]>([]);

    const [ position, setPosition ] = useState(STARTING_FEN);

    useEffect(() => {
        setPosition(currentStateTreeNode.state.fen);

        setHighlightedSquares([]);
        setUserArrows([]);

        if (!getSettings().analysis.suggestionArrows) return;

        const topLine = currentStateTreeNode.state.topEngineLine();

        if (!topLine?.moves.length) {
            return setSuggestionArrows([]);
        }

        const uciMove = parseUciMove(topLine.moves[0].uci);

        setSuggestionArrows([
            [
                uciMove.from,
                uciMove.to,
                "#98bc49"
            ] as Arrow
        ]);
    }, [currentStateTreeNode]);

    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardRef.current) return;

        const boardResizeObserver = new ResizeObserver(entries => {
            setAnalysisBoardWidth(entries[0].target.clientWidth);
        });

        boardResizeObserver.observe(boardRef.current);
    }, []);

    const squareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
        ({ style, children, square }, ref) => {
            const { currentStateTreeNode } = useAnalysisBoardStore();

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
        setHighlightedSquares(prev => (
            prev.includes(square)
                ? prev.filter(
                    highlightedSquare => highlightedSquare != square
                )
                : [ ...prev, square ]
        ));
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
        const addedNode = currentStateTreeNode.addChildMove(move.san);

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
                <HighlightedSquaresContext.Provider
                    value={highlightedSquares}
                >
                    <Chessboard
                        position={position}
                        onSquareClick={() => {
                            setHighlightedSquares([]);
                            setUserArrows([]);
                        }}
                        onSquareRightClick={toggleSquareHighlight}
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