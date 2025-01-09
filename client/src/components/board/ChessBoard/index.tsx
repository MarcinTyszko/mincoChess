import React from "react";
import { Chessboard } from "react-chessboard";
import {
    CustomSquareRenderer,
    Square
} from "react-chessboard/dist/chessboard/types";

import useChessBoardStore from "@stores/ChessBoardStore";
import PlayerProfile from "../PlayerProfile";
import Breakpoints from "@constants/Breakpoints";
import useLayoutStore from "@stores/LayoutStore";

import * as styles from "./ChessBoard.module.css";

function getSquareRenderer(): CustomSquareRenderer {
    const { highlightedSquares } = useChessBoardStore();

    return ({ children, style, square }) => (
        <div style={{ ...style, position: "relative" }}>
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
        </div>
    );
}

function ChessBoard() {
    const {
        contentSectionHeight,
        analysisBoardContainerWidth
    } = useLayoutStore();

    const {
        highlightedSquares,
        addSquareHighlight,
        removeSquareHighlight,
        clearSquareHighlights
    } = useChessBoardStore();

    function highlightSquare(square: Square) {
        if (highlightedSquares.includes(square)) {
            return removeSquareHighlight(square);
        }

        addSquareHighlight(square);
    }

    return <div className={styles.wrapper}>
        <PlayerProfile profile={{
            image: require("@assets/img/defaultprofile.svg"),
            title: "GM",
            username: "Plankton Kasparov",
            rating: 2812
        }}/>

        <div className={styles.boardContainer}>
            <svg className={styles.evaluationBar}>
                <text>poop</text>
            </svg>

            <div
                className={styles.board}
                style={{
                    width: innerWidth > Breakpoints.MOBILE_LAYOUT
                        ? (
                            `min(${contentSectionHeight - 150}px, `
                            + `${analysisBoardContainerWidth - 120}px)`
                        )
                        : undefined
                }}
            >
                <Chessboard
                    onSquareClick={clearSquareHighlights}
                    onSquareRightClick={highlightSquare}
                    customSquare={getSquareRenderer()}
                />
            </div>
        </div>

        <PlayerProfile
            profile={{
                image: require("@assets/img/defaultprofile.svg"),
                title: "IM",
                username: "Levy SquarePants",
                rating: 2322
            }}
            bottom
        />
    </div>;
}

export default ChessBoard;