import React from "react";

import { Chessboard } from "react-chessboard";
import PlayerProfile from "../PlayerProfile";

import * as styles from "./ChessBoard.module.css";

function ChessBoard() {
    return <div className={styles.wrapper}>
        <PlayerProfile
            profileImage={require("@assets/img/defaultprofile.svg")}
            rating={2322}
            title="IM"
        >
            Eugene Kasparov
        </PlayerProfile>

        <Chessboard/>

        <PlayerProfile
            profileImage={require("@assets/img/defaultprofile.svg")}
            rating={2678}
            title="GM"
            bottom
        >
            Levy SquarePants
        </PlayerProfile>
    </div>;
}

export default ChessBoard;