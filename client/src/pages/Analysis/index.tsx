import React from "react";

import ChessBoard from "@components/board/ChessBoard";

import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <div className={styles.gameContainer}>
            <ChessBoard/>
        </div>

        <div className={styles.reportContainer}>
            Game Report
        </div>
    </div>;
}

export default Analysis;