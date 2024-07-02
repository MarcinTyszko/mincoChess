import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Game } from "wintrchess";
import { getChessComGames } from "@lib/games";
import Button from "@components/common/Button";
import MonthSelector from "@components/common/MonthSelector";

import GameSearchMenuProps from "./GameSearchMenuProps";
import * as styles from "./GameSearchMenu.module.css";

function GameSearchMenu({ username, gameSource, setOpen }: GameSearchMenuProps) {
    const { t } = useTranslation();

    const [ games, setGames ] = useState<Game[] | null>(null);
    const [ searchError, setSearchError ] = useState<string | null>(null);

    useEffect(() => {
        const currentDate = new Date();

        loadGames(
            currentDate.getMonth() + 1,
            currentDate.getFullYear()
        );
    }, []);

    function closeMenu() {
        if (!setOpen) return;
        setOpen(false);
    }

    async function loadGames(month: number, year: number) {
        setGames(null);

        try {
            switch (gameSource.key) {
                case "chessCom":
                    setGames(
                        await getChessComGames(username, month, year)
                    );
                    break;
                case "lichess":
                    break;
                case "chessKid":
                    break;
            }

            setSearchError(null);
        } catch {
            setSearchError(
                t("pages.analysis.gameSearchMenu.userNotFound")
            );
        }
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
                onMonthChange={loadGames} 
                locked={searchError != null}
            />

            {/* Note: Game listings here are currently a stub. */}
            <div className={styles.list}>
                {
                    searchError ?
                        <span style={{color: "red"}}>{searchError}</span>
                        : games ?
                            (games.length > 0 ?
                                games.map(game => <div>
                                    {game.players?.white.username} vs {game.players?.black.username}
                                </div>)
                                : t("pages.analysis.gameSearchMenu.noGamesFound"))
                            : t("pages.analysis.gameSearchMenu.loading")
                }
            </div>
        </div>
    </div>;
}

export default GameSearchMenu;