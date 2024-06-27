import React from "react";

import { Chessboard } from "react-chessboard";
import PlayerProfile from "../PlayerProfile";

import * as styles from "./ChessBoard.module.css";

function ChessBoard() {
    return <div className={styles.wrapper}>
        <PlayerProfile profile={{
            image: require("@assets/img/defaultprofile.svg"),
            title: "GM",
            username: "Plankton Kasparov"
        }}/>

        <Chessboard/>

        <PlayerProfile
            profile={{
                image: require("@assets/img/defaultprofile.svg"),
                title: "IM",
                username: "Levy SquarePants"
            }}
            bottom
        />
    </div>;
}

export default ChessBoard;