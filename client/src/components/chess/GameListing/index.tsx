import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { uniqueId } from "lodash-es";

import { GameResult, getOpinionatedGameResult } from "shared/constants/game/GameResult";
import PlayerProfile from "shared/types/game/PlayerProfile";
import TimeControl from "shared/constants/game/TimeControl";
import { formatDate } from "shared/lib/utils/date";
import Button from "@/components/common/Button";
import displayToast from "@/lib/toast";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

import iconTimecontrolsBullet from "@assets/img/timeControls/bullet.png";
import iconTimecontrolsBlitz from "@assets/img/timeControls/blitz.png";
import iconTimecontrolsRapid from "@assets/img/timeControls/rapid.png";
import iconTimecontrolsClassical from "@assets/img/timeControls/classical.svg";
import iconTimecontrolsCorrespondence from "@assets/img/timeControls/correspondence.png";
import iconGameresultsUnopinionated_win from "@assets/img/gameResults/unopinionated_win.png";
import iconGameresultsDraw from "@assets/img/gameResults/draw.png";
import iconGameresultsUnopinionated_lose from "@assets/img/gameResults/unopinionated_lose.png";
import iconGameresultsOpinionated_win from "@assets/img/gameResults/opinionated_win.png";
import iconGameresultsOpinionated_lose from "@assets/img/gameResults/opinionated_lose.png";
import iconInterfaceCopy from "@assets/img/interface/copy.svg";

const timeControlIcons = {
    [TimeControl.BULLET]: iconTimecontrolsBullet,
    [TimeControl.BLITZ]: iconTimecontrolsBlitz,
    [TimeControl.RAPID]: iconTimecontrolsRapid,
    [TimeControl.CLASSICAL]: iconTimecontrolsClassical,
    [TimeControl.CORRESPONDENCE]: iconTimecontrolsCorrespondence
};

// Gets a game result icon from white's result
const gameResultIcons = {
    unopinionated: {
        [GameResult.WIN]: iconGameresultsUnopinionated_win,
        [GameResult.DRAW]: iconGameresultsDraw,
        [GameResult.LOSE]: iconGameresultsUnopinionated_lose,
        [GameResult.UNKNOWN]: iconGameresultsDraw
    },
    opinionated: {
        [GameResult.WIN]: iconGameresultsOpinionated_win,
        [GameResult.DRAW]: iconGameresultsDraw,
        [GameResult.LOSE]: iconGameresultsOpinionated_lose,
        [GameResult.UNKNOWN]: iconGameresultsDraw
    }
};

// Map of game results to their tooltip keys in translation file
const gameResultTooltipCodes = {
    [GameResult.WIN]: "win",
    [GameResult.DRAW]: "draw",
    [GameResult.LOSE]: "lose",
    [GameResult.UNKNOWN]: "unknown"
};

const maxProfileLength = 19;

function cutUsername(profile: PlayerProfile) {
    const titleLength = profile.title
        ? profile.title.length + 1
        : 0;
    const usernameLength = (profile.username || "Unknown").length || 0;
    const profileLength = titleLength + usernameLength;

    const username = profile.username || "Unknown";

    return profileLength > maxProfileLength
        ? username.slice(0, maxProfileLength - titleLength - 3) + "..."
        : username;
}

function GameListing({
    game,
    perspective,
    onClick
}: GameListingProps) {
    const { t } = useTranslation("common");

    const displayResult = useMemo(() => {
        if (!game.players.white.result) return;

        return perspective
            ? getOpinionatedGameResult(
                game.players.white.result,
                perspective
            )
            : game.players.white.result;
    }, [game, perspective]);

    const listingId = useMemo(uniqueId, []);

    function copyPGN() {
        navigator.clipboard.writeText(game.pgn);

        displayToast({
            message: t("shareGame.copyPGNToast"),
            theme: "success"
        });
    }

    return <div
        className={
            `${styles.gameListing} ${onClick && styles.selectableListing}`
        }
        onClick={() => onClick?.(game)}
    >
        {game.timeControl && <div style={{ width: "30px" }}>
            <img
                className={styles.timeControlIcon}
                src={timeControlIcons[game.timeControl]}
                title={game.timeControl}
            />
        </div>}

        <div style={{ width: "250px" }}>
            {Object.values(game.players)
                .map(player => <div className={styles.playerProfile}>
                    {player.title && <span className={styles.playerTitle}>
                        {player.title}
                    </span>}
                    
                    <div className={styles.usersColour} style={{
                        backgroundColor: player === game.players.white
                            ? "whitesmoke" : "black"
                    }}/>

                    <span>{cutUsername(player)}</span>
    
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

        <div style={{ width: "110px" }}>
            <span title={game.date?.toLocaleString()}>
                {game.date ? formatDate(new Date(game.date)) : t(
                    "gameListing.gameResults.opinionated.unknown"
                )}
            </span>
        </div>

        {displayResult && <div style={{ width: "20px" }}>
            <img
                src={perspective
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
        </div>}

        <Button
            className={styles.copyButton}
            icon={iconInterfaceCopy}
            tooltipId={`game-listing-copy-${listingId}`}
            onClick={event => {
                event.stopPropagation();
                copyPGN();
            }}
        />

        <Tooltip
            id={`game-listing-copy-${listingId}`}
            content={t("gameListing.copyPGN")}
            delayShow={500}
        />
    </div>;
}

export default GameListing;