import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Game } from "wintrchess";
import GameSource from "@constants/GameSource";
import getChessComGames from "@lib/games/chessCom";
import getLichessGames from "@lib/games/lichess";
import { UserNotFoundError } from "@lib/errors";
import DialogCloseButton from "@components/common/DialogCloseButton";
import MonthSelector from "@components/common/MonthSelector";
import GameListing from "@components/common/GameListing";
import useGameSelectorStore from "@stores/GameSelectorStore";

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
    setOpen
}: GameSearchMenuProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { setSelectedGame } = useGameSelectorStore();

    const [ month, setMonth ] = useState(new Date().getUTCMonth());
    const [ year, setYear ] = useState(new Date().getUTCFullYear());

    const { data: games, status, fetchStatus, error } = useQuery({ 
        queryKey: ["games", gameSource.key, username, month, year], 
        queryFn: () => fetchGames(gameSource, username, month, year),
        retry: (failureCount, error) => {
            return !(error instanceof UserNotFoundError);
        },
        retryDelay: 2000,
        staleTime: Infinity
    });

    function closeMenu() {
        if (!setOpen) return;
        setOpen(false);
    }

    function selectGame(game: Game) {
        setSelectedGame(game);
        closeMenu();
    }

    return <div className={styles.wrapper}>
        <div className={styles.menu}>
            <DialogCloseButton onClick={closeMenu} />

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
                    && <span className={styles.statusMessage} style={{ color: "red" }}>
                        {t(error.message)}
                    </span>
                }

                {
                    fetchStatus == "fetching"
                    && <span className={styles.statusMessage}>
                        {t("pages.analysis.gameSearchMenu.loading")}
                    </span>
                }

                {
                    status == "success" && fetchStatus == "idle"
                    && (
                        games.length > 0 ?
                            games
                                .slice()
                                .reverse()
                                .map(game => <GameListing 
                                    game={game}
                                    onClick={selectGame}
                                />)
                            : t("pages.analysis.gameSearchMenu.noGamesFound")
                    )
                }
            </div>
        </div>
    </div>;
}

export default GameSearchMenu;