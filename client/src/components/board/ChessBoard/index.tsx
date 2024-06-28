import React from "react";

import { Chessboard } from "react-chessboard";
import PlayerProfile from "../PlayerProfile";

import * as styles from "./ChessBoard.module.css";

function ChessBoard() {
    return <div className={styles.wrapper}>
        <PlayerProfile profile={{
            image: require("@assets/img/defaultprofile.svg"),
            title: "GM",
            username: "Plankton Kasparov",
            rating: 2812
        }}/>

        <Chessboard/>

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