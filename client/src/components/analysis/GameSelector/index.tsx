import React from "react";

import * as styles from "./GameSelector.module.css";

function GameSelector() {
    return <div className={styles.wrapper}>
        <div className={styles.gameSourceSection}>
            <div className={styles.gameSourceLabel}>
                Load game from
            </div>

            <select className={styles.gameSourceSelector}>
                <option value="pgn">PGN</option>
                <option value="chesscom">Chess.com</option>
                <option value="lichessorg">Lichess.org</option>
                <option value="chesskid">ChessKid</option>
            </select>
        </div>

        <textarea
            className={styles.inputGame}
            placeholder="PGN..."
        ></textarea>
    </div>;
}

export default GameSelector;