import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
    GameResult,
    getOpinionatedGameResult,
    PlayerProfile,
    TimeControl,
    formatDate
} from "wintrchess";
import Button from "../Button";

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
        [GameResult.LOSE]: require("@assets/img/gameResults/unopinionated_lose.png"),
        [GameResult.UNKNOWN]: require("@assets/img/gameResults/draw.png")
    },
    opinionated: {
        [GameResult.WIN]: require("@assets/img/gameResults/opinionated_win.png"),
        [GameResult.DRAW]: require("@assets/img/gameResults/draw.png"),
        [GameResult.LOSE]: require("@assets/img/gameResults/opinionated_lose.png"),
        [GameResult.UNKNOWN]: require("@assets/img/gameResults/draw.png")
    }
};

// Map of game results to their tooltip keys in translation file
const gameResultTooltipCodes = {
    [GameResult.WIN]: "win",
    [GameResult.DRAW]: "draw",
    [GameResult.LOSE]: "lose",
    [GameResult.UNKNOWN]: "unknown"
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

    const displayResult = useMemo(() => {
        if (!game.players.white.result) return;

        return perspective
            ? getOpinionatedGameResult(
                game.players.white.result,
                perspective
            )
            : game.players.white.result;
    }, [game, perspective]);

    return <div
        className={
            `${styles.gameListing} ${onClick && styles.selectableListing}`
        }
        onClick={() => onClick?.(game)}
    >
        {
            game.timeControl
            && <div style={{ width: "30px" }}>
                <img
                    className={styles.timeControlIcon}
                    src={timeControlIcons[game.timeControl]}
                    title={game.timeControl}
                />
            </div>
        }

        <div style={{ width: "250px" }}>
            {Object.values(game.players)
                .map(player => <div className={styles.playerProfile}>
                    {
                        player.title
                        && <span className={styles.playerTitle}>
                            {player.title}
                        </span>
                    }
                    
                    <div 
                        className={styles.usersColour} 
                        style={{
                            backgroundColor: player === game.players.white ? "whitesmoke" : "black"
                        }} 
                    />

                    <span>
                        {cutUsername(player)}
                    </span>
    
                    <span style={{color: "grey"}}>
                        ({player.rating || "?"})
                    </span>
                </div>)
            }
        </div>

        {/* {
            game.report
            && <div>
                <span>{game.report.accuracies.white}</span>
                <span>{game.report.accuracies.black}</span>
            </div>
        } */}

        <div style={{width: "110px"}}>
            <span title={game.date?.toLocaleString()}>
                {game.date ? formatDate(game.date) : "Unknown"}
            </span>
        </div>

        {
            displayResult
            && <div style={{ width: "20px" }}>
                <img
                    src={
                        perspective
                            ? gameResultIcons.opinionated[displayResult]
                            : gameResultIcons.unopinionated[displayResult]
                    }
                    title={t(
                        "gameListing.gameResults."
                        + (perspective ? "opinionated." : "unopinionated.")
                        + gameResultTooltipCodes[displayResult]
                    )}
                    style={{ width: "100%" }}
                />
            </div>
        }

        <Button
            className={styles.copyButton}
            icon={require("@assets/img/interface/copy.svg")}
            tooltip={t("gameListing.copyPGN")}
            onClick={event => {
                event.stopPropagation();

                navigator.clipboard.writeText(game.pgn);

                toast.success(
                    t("gameListing.copyPGNToast"),
                    {
                        position: "bottom-left",
                        theme: "dark",
                        pauseOnHover: false,
                        closeOnClick: true,
                        closeButton: false,
                        style: {
                            fontFamily: "JetBrains Mono"
                        }
                    }
                );
            }}
        />

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