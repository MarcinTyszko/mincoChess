import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import GameSource from "@constants/GameSource";
import getChessComGames from "@lib/games/chessCom";
import getLichessGames from "@lib/games/lichess";
import { UserNotFoundError } from "@lib/games/errors";
import Button from "@components/common/Button";
import MonthSelector from "@components/common/MonthSelector";

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
    }

    return [];
}

function GameSearchMenu({ username, gameSource, setOpen }: GameSearchMenuProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [ month, setMonth ] = useState(new Date().getUTCMonth());
    const [ year, setYear ] = useState(new Date().getUTCFullYear());

    const { data: games, status, fetchStatus, error } = useQuery({ 
        queryKey: ["games", username, month, year], 
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

    return <div className={styles.wrapper}>
        <div className={styles.menu}>
            <Button
                icon={require("@assets/img/close.svg")}
                iconSize="30px"
                style={{
                    backgroundColor: "#222",
                    padding: "5px",
                    position: "absolute",
                    top: "5px",
                    right: "5px"
                }}
                onClick={closeMenu}
            />

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
                    setMonth(month);
                    setYear(year);

                    queryClient.cancelQueries({ queryKey: ["games"] });
                }} 
                locked={status == "error"}
            />

            {/* Note: Game listings here are currently a stub. */}
            <div className={styles.list}>
                {
                    status == "error"
                    && <span style={{ color: "red" }}>{t(error.message)}</span>
                }

                {
                    (status == "pending" || fetchStatus == "fetching")
                    && <span>{t("pages.analysis.gameSearchMenu.loading")}</span>
                }

                {
                    status == "success" && fetchStatus == "idle"
                    && (
                        games.length > 0 ?
                            games.map(game => <div>
                                {game.players?.white.username} vs {game.players?.black.username}
                            </div>)
                            : t("pages.analysis.gameSearchMenu.noGamesFound")
                    )
                }
            </div>
        </div>
    </div>;
}

export default GameSearchMenu;