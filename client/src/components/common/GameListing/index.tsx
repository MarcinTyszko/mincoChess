import React from "react";

import {
    GameResult,
    getOpinionatedGameResult,
    PlayerProfile
} from "wintrchess";
import Button from "../Button";
import { formatDate } from "@lib/utils/date";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

const MAX_PROFILE_LENGTH = 19;

function cutUsername(profile: PlayerProfile) {
    const titleLength = profile.title
        ? profile.title.length + 1
        : 0;
    const usernameLength = (profile.username || "Unknown").length || 0;
    const profileLength = titleLength + usernameLength;

    const username = profile.username || "Unknown";

    return profileLength > MAX_PROFILE_LENGTH
        ? username.slice(0, MAX_PROFILE_LENGTH - titleLength - 3) + "..."
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
        
                        <span>{cutUsername(player)}</span>
        
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
                        [GameResult.WIN]: "Win",
                        [GameResult.DRAW]: "Draw",
                        [GameResult.LOSE]: "Loss",
                        [GameResult.UNKNOWN]: "Unknown"
                    }[
                        getOpinionatedGameResult(
                            game.players.white.result,
                            perspective
                        )
                    ]
                    : {
                        [GameResult.WIN]: "White won",
                        [GameResult.DRAW]: "Draw",
                        [GameResult.LOSE]: "Black won",
                        [GameResult.UNKNOWN]: "Unknown"
                    }[game.players.white.result]
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