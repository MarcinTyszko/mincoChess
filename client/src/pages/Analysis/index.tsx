import React from "react";

import ChessBoard from "@components/board/ChessBoard";
import GameSelector from "@components/analysis/GameSelector";
import Button from "@components/common/Button";

import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <div className={styles.gameContainer}>
            <ChessBoard/>
        </div>

        <div className={styles.reportContainer}>
            <div className={styles.title}>
                Game Report
            </div>

            <GameSelector/>

            <Button
                icon={require("@assets/img/analysis.svg")}
                iconSize="30px"
                style={{
                    fontSize: "1.1rem"
                }}
            >
                Analyse
            </Button>
        </div>
    </div>;
}

export default Analysis;