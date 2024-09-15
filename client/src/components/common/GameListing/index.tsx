import React from "react";

import { getGenericGameResult, GenericGameResult } from "wintrchess";
import Button from "../Button";
import { formatDate } from "@lib/utils/date";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

function GameListing({ game, onClick }: GameListingProps) {
    return <div
        className={
            `${styles.gameListing} ${onClick && styles.selectableListing}`
        }
        onClick={() => onClick?.(game)}
    >
        <div>
            {game.timeControl || "?"}
        </div>

        <div>
            {
                Object.values(game.players)
                    .map(player => <div className={styles.playerProfile}>
                        {
                            !!player.title
                            && <span className={styles.playerTitle}>
                                {player.title}
                            </span>
                        }
        
                        <span>{player.username || "Unknown"}</span>
        
                        <span className={styles.playerRating}>
                            ({player.rating || "?"})
                        </span>
                    </div>)
            }
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

        <div>
            {game.date ? formatDate(game.date) : "Unknown"}
        </div>

        <Button
            icon={require("@assets/img/copy.svg")}
            tooltip="Copy PGN"
            onClick={event => {
                event.stopPropagation();
                navigator.clipboard.writeText(game.pgn);
            }}
        />

        <input type="checkbox" />
    </div>;
}

export default GameListing;
