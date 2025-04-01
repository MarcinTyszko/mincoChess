import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Game, getColourPlayed } from "wintrchess";
import GameSource from "@constants/GameSource";
import getChessComGames from "@lib/games/chessCom";
import getLichessGames from "@lib/games/lichess";
import { UserNotFoundError } from "@lib/errors";
import Dialog from "@components/common/Dialog";
import Loader from "@components/common/Loader";
import ErrorMessage from "@components/common/ErrorMessage";
import MonthSelector from "@components/common/MonthSelector";
import GameListing from "@components/common/GameListing";

import GameSearchMenuProps from "./GameSearchMenuProps";
import * as styles from "./GameSearchMenu.module.css";

async function fetchGames(
    gameSource: GameSource,
    username: string,
    month: number,
    year: number
) {
    switch (gameSource.key) {
        case "chessCom":
            return await getChessComGames(username, month, year);
        case "lichess":
            return await getLichessGames(username, month, year);
        default:
            return [];
    }
}

function GameSearchMenu({
    username,
    gameSource,
    setOpen,
    setSelectedGame
}: GameSearchMenuProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [ month, setMonth ] = useState(new Date().getMonth() + 1);
    const [ year, setYear ] = useState(new Date().getFullYear());

    const longFetchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [ isLongFetch, setIsLongFetch ] = useState(false);

    const { data: games, status, fetchStatus, error } = useQuery({ 
        queryKey: ["games", gameSource.key, username, month, year], 
        queryFn: () => {
            if (longFetchTimerRef.current != null) {
                clearTimeout(longFetchTimerRef.current);
                setIsLongFetch(false);
            }

            longFetchTimerRef.current = setTimeout(
                () => setIsLongFetch(true),
                2500
            );

            return fetchGames(gameSource, username, month, year);
        },
        retry: (failureCount, error) => {
            return !(error instanceof UserNotFoundError);
        },
        retryDelay: 2000,
        staleTime: Infinity
    });

    function selectListing(game: Game) {
        toast.success(
            "Game selected!",
            {
                position: "bottom-left",
                theme: "dark",
                pauseOnHover: false,
                closeOnClick: true,
                closeButton: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                style: {
                    fontFamily: "JetBrains Mono"
                }
            }
        );

        setSelectedGame?.(game);
        setOpen?.(false);
    }

    return <Dialog
        className={styles.dialog}
        setOpen={setOpen}
    >
        <span className={styles.title}>
            {t("pages.analysis.gameSearchMenu.title")}
        </span>

        <span className={styles.sourceTitle}>
            {gameSource.title}

            <img src={require("@assets/img/rightchevron.svg")} />

            {username}
        </span>

        <MonthSelector 
            onMonthChange={(month, year) => {
                // Cancel other queries for games
                queryClient.cancelQueries({ queryKey: ["games"] });

                setMonth(month);
                setYear(year);
            }} 
            locked={status == "error"}
        />

        <div className={styles.list}>
            {
                status == "error" && fetchStatus == "idle"
                && <ErrorMessage>
                    {t(error.message)}
                </ErrorMessage>
            }

            {
                fetchStatus == "fetching"
                && <div className={styles.loadingMessage}>
                    <Loader/>
                    
                    <span>
                        {t("pages.analysis.gameSearchMenu.loading")}
                    </span>

                    {
                        isLongFetch
                        && <span>
                            {t("pages.analysis.gameSearchMenu.loadingLong")}
                        </span>
                    }
                </div>
            }

            {
                status == "success" && fetchStatus == "idle"
                && (
                    games.length > 0 ?
                        games
                            .slice()
                            .map(game => <GameListing 
                                game={game}
                                perspective={getColourPlayed(game, username)}
                                onClick={selectListing}
                            />)
                        : t("pages.analysis.gameSearchMenu.noGamesFound")
                )
            }
        </div>
    </Dialog>;
}

export default GameSearchMenu;