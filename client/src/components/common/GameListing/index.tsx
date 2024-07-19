import React from "react";

import { getGenericGameResult, GenericGameResult } from "wintrchess";
import { monthNames } from "@lib/utils/date";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

function GameListing({
    game,
    moveCount
}: GameListingProps) {
    return <div className={styles.gameListing}>
        <div>
            {game.timeControl || "?"}
        </div>
        <div>
            <div className={styles.playerInfo}>
                <span className={styles.playerTitle}>{game.players.white.title}</span> 
                <span>{game.players.white.username || "Unknown"}</span>
                <span className={styles.playerRating}>
                    ({game.players.white.rating || "?"})
                </span>
            </div>
            <div className={styles.playerInfo}>
                <span className={styles.playerTitle}>{game.players.black.title}</span> 
                <span>{game.players.black.username || "Unknown"}</span>
                <span className={styles.playerRating}>
                    ({game.players.black.rating || "?"})
                </span>
            </div>
        </div>
        <div>
            {
                // Produce a string indicating if white won, lost or drew the game
                {
                    [GenericGameResult.WIN]: "White won",
                    [GenericGameResult.DRAW]: "Draw",
                    [GenericGameResult.LOSE]: "Black won"
                }[getGenericGameResult(game.players.white.result)]
            }
        </div>
        <div>
            <div>{game.players.white.accuracy || "?"}</div>
            <div>{game.players.black.accuracy || "?"}</div>
        </div>
        <div>{moveCount}</div>
        <div>
            {game.date ? (
                `${monthNames[game.date.getMonth()]} ${game.date.getDate()}, ${game.date.getFullYear()}`
            ) : (
                "Unknown"
            )}
        </div>
        <div>
            <input type="checkbox" />
        </div>
    </div>;
}

export default GameListing;
