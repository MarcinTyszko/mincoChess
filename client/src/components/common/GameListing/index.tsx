import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import {
    GameResult,
    getOpinionatedGameResult,
    PlayerProfile,
    TimeControl
} from "wintrchess";
import Button from "../Button";
import { formatDate } from "@lib/utils/date";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

const timeControlIcons = {
    [TimeControl.BULLET]: require("@assets/img/timeControls/bullet.png"),
    [TimeControl.BLITZ]: require("@assets/img/timeControls/blitz.svg"),
    [TimeControl.RAPID]: require("@assets/img/timeControls/rapid.svg"),
    [TimeControl.CLASSICAL]: require("@assets/img/timeControls/classical.svg"),
    [TimeControl.CORRESPONDENCE]: require("@assets/img/timeControls/correspondence.svg")
};

// Gets a game result icon from white's result
const gameResultIcons = {
    unopinionated: {
        [GameResult.WIN]: require("@assets/img/gameResults/unopinionated_win.png"),
        [GameResult.DRAW]: require("@assets/img/gameResults/draw.png"),
        [GameResult.LOSE]: require("@assets/img/gameResults/unopinionated_lose.png")
    },
    opinionated: {
        [GameResult.WIN]: require("@assets/img/gameResults/opinionated_win.png"),
        [GameResult.DRAW]: require("@assets/img/gameResults/draw.png"),
        [GameResult.LOSE]: require("@assets/img/gameResults/opinionated_lose.png")
    }
};

// Map of game results to their tooltip keys in translation file
const gameResultTooltipCodes = {
    [GameResult.WIN]: "win",
    [GameResult.DRAW]: "draw",
    [GameResult.LOSE]: "lose"
};

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
    const { t } = useTranslation();

    function getDisplayResult() {
        if (!game.players.white.result) return;

        return perspective
            ? getOpinionatedGameResult(
                game.players.white.result,
                perspective
            )
            : game.players.white.result;
    }

    const displayResultRef = useRef(getDisplayResult());

    return <div
        className={
            `${styles.gameListing} ${onClick && styles.selectableListing}`
        }
        onClick={() => onClick?.(game)}
    >
        {
            game.timeControl
            && <div style={{width: "30px"}}>
                <img
                    className={styles.timeControlIcon}
                    src={timeControlIcons[game.timeControl]}
                    title={game.timeControl}
                />
            </div>
        }

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

        {
            game.report
            && <div>
                <div>{game.report.accuracies.white}</div>
                <div>{game.report.accuracies.black}</div>
            </div>
        }

        <div style={{width: "110px"}}>
            <span title={game.date?.toLocaleString()}>
                {game.date ? formatDate(game.date) : "Unknown"}
            </span>
        </div>

        {
            displayResultRef.current
            && <div className={styles.resultIconContainer}>
                <img
                    src={
                        perspective
                            ? gameResultIcons.opinionated[displayResultRef.current]
                            : gameResultIcons.unopinionated[displayResultRef.current]
                    }
                    title={t(
                        "gameListing.gameResults."
                        + (perspective ? "opinionated." : "unopinionated.")
                        + gameResultTooltipCodes[displayResultRef.current]
                    )}
                    style={{width: "100%"}}
                />
            </div>
        }

        <div>
            <Button
                icon={require("@assets/img/copy.svg")}
                tooltip={t("gameListing.copyPGN")}
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