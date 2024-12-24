import React from "react";

import {
    GenericGameResult,
    getGenericGameResult,
    getOpinionatedGameResult
} from "wintrchess";
import Button from "../Button";
import { formatDate } from "@lib/utils/date";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

const MAX_USERNAME_LENGTH = 19;

function cutUsername(username: string) {
    return username.length > MAX_USERNAME_LENGTH
        ? username.slice(0, MAX_USERNAME_LENGTH - 3) + "..."
        : username;
}

function GameListing({
    game, 
    perspective,
    onClick
}: GameListingProps) {
    return <div
        className={
            `${styles.gameListing} ${onClick && styles.selectableListing}`
        }
        onClick={() => onClick?.(game)}
    >
        <div style={{width: "50px"}}>
            {game.timeControl || "?"}
        </div>

        <div style={{width: "250px"}}>
            {
                Object.values(game.players)
                    .map(player => <div className={styles.playerProfile}>
                        {
                            !!player.title
                            && <span className={styles.playerTitle}>
                                {player.title}
                            </span>
                        }
        
                        <span>{cutUsername(player.username || "Unknown")}</span>
        
                        <span style={{color: "grey"}}>
                            ({player.rating || "?"})
                        </span>
                    </div>)
            }
        </div>

        <div style={{width: "95px"}}>
            {
                perspective
                    ? {
                        [GenericGameResult.WIN]: "Win",
                        [GenericGameResult.DRAW]: "Draw",
                        [GenericGameResult.LOSE]: "Loss",
                        [GenericGameResult.UNKNOWN]: "Unknown"
                    }[
                        getOpinionatedGameResult(
                            getGenericGameResult(game.players.white.result),
                            perspective
                        )
                    ]
                    : {
                        [GenericGameResult.WIN]: "White won",
                        [GenericGameResult.DRAW]: "Draw",
                        [GenericGameResult.LOSE]: "Black won",
                        [GenericGameResult.UNKNOWN]: "Unknown"
                    }[
                        getGenericGameResult(game.players.white.result)
                    ]
            }
        </div>

        {
            game.report
            && <div>
                <div>{game.report.accuracies.white}</div>
                <div>{game.report.accuracies.black}</div>
            </div>
        }

        <div style={{width: "110px"}}>
            {game.date ? formatDate(game.date) : "Unknown"}
        </div>

        <div>
            <Button
                icon={require("@assets/img/copy.svg")}
                tooltip="Copy PGN"
                onClick={event => {
                    event.stopPropagation();
                    navigator.clipboard.writeText(game.pgn);
                }}
            />
        </div>

        {
            onClick
            && <div>
                <input
                    type="checkbox"
                    onClick={event => event.stopPropagation()}
                />
            </div>
        }
    </div>;
}

export default GameListing;