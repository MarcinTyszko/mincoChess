import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { StatusCodes } from "http-status-codes";
import { truncate } from "lodash-es";

import { Game, getColourPlayed } from "shared/types/game/Game";
import PieceColour from "shared/constants/PieceColour";
import {
    GameResult,
    getOpinionatedGameResult
} from "shared/constants/game/GameResult";
import TimeControl from "shared/constants/game/TimeControl";
import { formatDate } from "shared/lib/utils/date";
import useLinkedAccountsStore from "@/stores/LinkedAccountsStore";
import useAutoAnalysisStore from "@/stores/AutoAnalysisStore";
import {
    fetchRecentGames,
    getGameKey,
    getMoveCount,
    RecentGamesSource
} from "@/lib/games/recentGames";
import { getArchivedGames } from "@/lib/gameArchive";
import LocalStorageKey from "@/constants/LocalStorageKey";
import Loader from "@/components/common/Loader";
import LogMessage from "@/components/common/LogMessage";

import * as styles from "./RecentGamesCard.module.css";

import iconTimeControlsBullet from "@assets/img/timeControls/bullet.png";
import iconTimeControlsBlitz from "@assets/img/timeControls/blitz.png";
import iconTimeControlsRapid from "@assets/img/timeControls/rapid.png";
import iconTimeControlsClassical from "@assets/img/timeControls/classical.svg";
import iconTimeControlsCorrespondence from "@assets/img/timeControls/correspondence.png";
import iconGameResultsDraw from "@assets/img/gameResults/draw.png";
import iconGameResultsWin from "@assets/img/gameResults/opinionated_win.png";
import iconGameResultsLose from "@assets/img/gameResults/opinionated_lose.png";
import iconGameResultsUnknown from "@assets/img/gameResults/unknown.png";

const PROFILE_RECENT_GAMES_LIMIT = 10;

const timeControlIcons = {
    [TimeControl.BULLET]: iconTimeControlsBullet,
    [TimeControl.BLITZ]: iconTimeControlsBlitz,
    [TimeControl.RAPID]: iconTimeControlsRapid,
    [TimeControl.CLASSICAL]: iconTimeControlsClassical,
    [TimeControl.CORRESPONDENCE]: iconTimeControlsCorrespondence
};

const gameResultIcons = {
    [GameResult.WIN]: iconGameResultsWin,
    [GameResult.DRAW]: iconGameResultsDraw,
    [GameResult.LOSE]: iconGameResultsLose,
    [GameResult.UNKNOWN]: iconGameResultsUnknown
};

/**
 * @description The player's accuracy in a game, preferring the accuracy
 * from the external service and falling back to the local analysis
 * stored in the archive.
 */
function getPlayerAccuracy(
    game: Game,
    archivedAccuracies: Game["accuracies"],
    colour: PieceColour
) {
    const accuracies = {
        white: game.accuracies?.white ?? archivedAccuracies?.white,
        black: game.accuracies?.black ?? archivedAccuracies?.black
    };

    return colour == PieceColour.WHITE
        ? accuracies.white
        : accuracies.black;
}

/**
 * @description Recent games from the profile owner's linked chess.com /
 * lichess account, in the style of a chess.com profile: time control,
 * players, moves, accuracy, date and result, plus the state of the
 * automatic background analysis.
 */
function RecentGamesCard() {
    const { t } = useTranslation("otherPages");

    const { chessCom, lichess, syncWithServer } = useLinkedAccountsStore();

    const autoAnalysisEntries = useAutoAnalysisStore(
        state => state.entries
    );

    const [ source, setSource ] = useState<RecentGamesSource>(
        chessCom || !lichess ? "chessCom" : "lichess"
    );

    useEffect(() => {
        syncWithServer();
    }, []);

    useEffect(() => {
        if (source == "chessCom" && !chessCom && lichess)
            setSource("lichess");
    }, [chessCom, lichess]);

    const username = source == "chessCom" ? chessCom : lichess;

    const { data: games, status } = useQuery({
        queryKey: ["profileRecentGames", source, username],
        queryFn: () => fetchRecentGames(
            source, username!, PROFILE_RECENT_GAMES_LIMIT
        ),
        enabled: !!username,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false
    });

    // Analysed games in the archive, matched to listed games by identity
    const { data: archivedGames } = useQuery({
        queryKey: ["profileArchiveIndex"],
        queryFn: async () => {
            const archiveResponse = await getArchivedGames();

            if (archiveResponse.status != StatusCodes.OK) return {};

            return Object.fromEntries(
                Object.entries(archiveResponse.games || {}).map(
                    ([ id, archivedGame ]) => [
                        getGameKey(archivedGame),
                        { id, accuracies: archivedGame.accuracies }
                    ]
                )
            );
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    if (!chessCom && !lichess) return null;

    function openGame(game: Game, archiveId?: string) {
        if (archiveId) {
            location.href = `/analysis?game=${archiveId}`;
            return;
        }

        localStorage.setItem(
            LocalStorageKey.PENDING_ANALYSIS_GAME,
            JSON.stringify(game)
        );

        location.href = "/analysis";
    }

    function renderAnalysisStatus(game: Game) {
        const gameKey = getGameKey(game);

        const queueEntry = autoAnalysisEntries.find(
            entry => entry.key == gameKey
        );

        const archiveId = queueEntry?.archiveId
            || archivedGames?.[gameKey]?.id;

        if (archiveId) return <span className={styles.statusAnalysed}>
            {t("profileRecentGames.status.analysed")}
        </span>;

        if (queueEntry?.status == "analysing")
            return <span className={styles.statusAnalysing}>
                {t("profileRecentGames.status.analysing", {
                    percent: Math.round(queueEntry.progress * 100)
                })}
            </span>;

        if (queueEntry?.status == "queued")
            return <span className={styles.statusQueued}>
                {t("profileRecentGames.status.queued")}
            </span>;

        if (queueEntry?.status == "error")
            return <span className={styles.statusError}>
                {t("profileRecentGames.status.error")}
            </span>;

        return null;
    }

    function renderGameRow(game: Game) {
        const gameKey = getGameKey(game);

        const perspective = username
            ? getColourPlayed(game, username)
            : PieceColour.WHITE;

        const result = game.players.white.result
            ? getOpinionatedGameResult(
                game.players.white.result, perspective
            )
            : GameResult.UNKNOWN;

        const queueEntry = autoAnalysisEntries.find(
            entry => entry.key == gameKey
        );

        const accuracy = getPlayerAccuracy(
            game,
            queueEntry?.accuracies
                ?? archivedGames?.[gameKey]?.accuracies,
            perspective
        );

        const moveCount = getMoveCount(game.pgn);

        const archiveId = queueEntry?.archiveId
            || archivedGames?.[gameKey]?.id;

        return <div
            key={gameKey}
            className={styles.gameRow}
            onClick={() => openGame(game, archiveId)}
        >
            <div className={styles.timeControlCell}>
                {game.timeControl && <img
                    className={styles.timeControlIcon}
                    src={timeControlIcons[game.timeControl]}
                    title={game.timeControl}
                />}
            </div>

            <div className={styles.playersCell}>
                {Object.entries(game.players).map(([ colour, player ]) => (
                    <div className={styles.playerRow} key={colour}>
                        <div
                            className={styles.playerColour}
                            style={{
                                backgroundColor: colour == "white"
                                    ? "whitesmoke" : "black"
                            }}
                        />

                        <span className={styles.playerName}>
                            {truncate(player.username, { length: 18 })}
                        </span>

                        <span className={styles.playerRating}>
                            ({player.rating || "?"})
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.resultCell}>
                <img
                    className={styles.resultIcon}
                    src={gameResultIcons[result]}
                />
            </div>

            <div className={styles.accuracyCell}>
                {accuracy != undefined
                    ? `${Number(accuracy).toFixed(1)}%`
                    : "–"
                }
            </div>

            <div className={styles.movesCell}>
                {moveCount ?? "–"}
            </div>

            <div className={styles.dateCell}>
                {game.date ? formatDate(new Date(game.date)) : "–"}
            </div>

            <div className={styles.statusCell}>
                {renderAnalysisStatus(game)}
            </div>
        </div>;
    }

    return <div className={styles.wrapper}>
        <div className={styles.header}>
            <span className={styles.title}>
                {t("profileRecentGames.title")}
            </span>

            <div className={styles.sourceRow}>
                {chessCom && <button
                    className={styles.sourceButton}
                    data-active={source == "chessCom"}
                    onClick={() => setSource("chessCom")}
                >
                    Chess.com
                </button>}

                {lichess && <button
                    className={styles.sourceButton}
                    data-active={source == "lichess"}
                    onClick={() => setSource("lichess")}
                >
                    Lichess
                </button>}
            </div>
        </div>

        {status == "pending" && <div className={styles.loading}>
            <Loader/>
        </div>}

        {status == "error" && <LogMessage>
            {t("profileRecentGames.fetchError")}
        </LogMessage>}

        {status == "success" && games.length > 0 && <>
            <div className={styles.headerRow}>
                <span className={styles.timeControlCell}/>

                <span className={styles.playersCell}>
                    {t("profileRecentGames.columns.players")}
                </span>

                <span className={styles.resultCell}>
                    {t("profileRecentGames.columns.result")}
                </span>

                <span className={styles.accuracyCell}>
                    {t("profileRecentGames.columns.accuracy")}
                </span>

                <span className={styles.movesCell}>
                    {t("profileRecentGames.columns.moves")}
                </span>

                <span className={styles.dateCell}>
                    {t("profileRecentGames.columns.date")}
                </span>

                <span className={styles.statusCell}/>
            </div>

            <div className={styles.list}>
                {games.map(renderGameRow)}
            </div>
        </>}

        {status == "success" && games.length == 0
            && <div className={styles.hint}>
                {t("profileRecentGames.noGames")}
            </div>
        }
    </div>;
}

export default RecentGamesCard;
