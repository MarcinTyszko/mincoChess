import React from "react";
import { Chessboard } from "react-chessboard";

import PlayerProfile from "../PlayerProfile";
import Breakpoints from "@constants/Breakpoints";
import useLayoutStore from "@stores/LayoutStore";

import * as styles from "./ChessBoard.module.css";

function ChessBoard() {
    const {
        contentSectionHeight,
        analysisBoardContainerWidth
    } = useLayoutStore();

    return <div className={styles.wrapper}>
        <PlayerProfile profile={{
            image: require("@assets/img/defaultprofile.svg"),
            title: "GM",
            username: "Plankton Kasparov",
            rating: 2812
        }}/>

        <div className={styles.boardContainer}>
            <svg className={styles.evaluationBar}>
                poop
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
                <Chessboard/>
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