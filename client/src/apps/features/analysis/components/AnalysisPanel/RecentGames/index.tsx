import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash-es";

import { Game, getColourPlayed } from "shared/types/game/Game";
import PieceColour from "shared/constants/PieceColour";
import useSettingsStore from "@/stores/SettingsStore";
import useLinkedAccountsStore from "@/stores/LinkedAccountsStore";
import useGameSelector from "@/hooks/useGameSelector";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import {
    fetchRecentGames,
    RecentGamesSource
} from "@/lib/games/recentGames";
import GameListing from "@/components/chess/GameListing";
import Loader from "@/components/common/Loader";
import LogMessage from "@/components/common/LogMessage";
import displayToast from "@/lib/toast";

import * as styles from "./RecentGames.module.css";

function RecentGames() {
    const { t } = useTranslation("analysis");

    const recentGamesEnabled = useSettingsStore(
        state => state.settings.analysis.recentGamesEnabled
    );

    const {
        chessCom,
        lichess,
        setLinkedAccounts,
        syncWithServer
    } = useLinkedAccountsStore();

    const { setSelectedGame } = useGameSelector();

    const setBoardFlipped = useAnalysisBoardStore(
        state => state.setBoardFlipped
    );

    const [ editing, setEditing ] = useState(false);
    const [ chessComInput, setChessComInput ] = useState("");
    const [ lichessInput, setLichessInput ] = useState("");

    const [ source, setSource ] = useState<RecentGamesSource>(
        chessCom || !lichess ? "chessCom" : "lichess"
    );

    useEffect(() => {
        syncWithServer();
    }, []);

    const username = source == "chessCom" ? chessCom : lichess;
    const anyAccountLinked = !!(chessCom || lichess);

    const { data: games, status } = useQuery({
        queryKey: ["recentGames", source, username],
        queryFn: () => fetchRecentGames(source, username!),
        enabled: !!username,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false
    });

    function openEditor() {
        setChessComInput(chessCom || "");
        setLichessInput(lichess || "");
        setEditing(true);
    }

    function saveAccounts() {
        setLinkedAccounts({
            chessCom: trim(chessComInput) || undefined,
            lichess: trim(lichessInput) || undefined
        });

        if (!trim(chessComInput) && trim(lichessInput)) {
            setSource("lichess");
        } else if (trim(chessComInput)) {
            setSource("chessCom");
        }

        setEditing(false);
    }

    function selectGame(game: Game) {
        setSelectedGame(game);

        if (username) {
            setBoardFlipped(
                getColourPlayed(game, username) == PieceColour.BLACK
            );
        }

        displayToast({
            message: t("gameSearchMenu.selectedToast"),
            theme: "success",
            autoClose: 2
        });
    }

    if (!recentGamesEnabled) return null;

    return <div className={styles.wrapper}>
        <div className={styles.header}>
            <span className={styles.title}>
                {t("recentGames.title")}
            </span>

            <button className={styles.editButton} onClick={openEditor}>
                {anyAccountLinked
                    ? t("recentGames.editButton")
                    : t("recentGames.linkButton")
                }
            </button>
        </div>

        {editing && <div className={styles.editor}>
            <label className={styles.editorField}>
                <span>Chess.com</span>

                <input
                    className={styles.editorInput}
                    placeholder={t(
                        "gameSelector.sourcePlaceholders.chessCom"
                    )}
                    value={chessComInput}
                    onChange={event => (
                        setChessComInput(event.target.value)
                    )}
                />
            </label>

            <label className={styles.editorField}>
                <span>Lichess</span>

                <input
                    className={styles.editorInput}
                    placeholder={t(
                        "gameSelector.sourcePlaceholders.lichess"
                    )}
                    value={lichessInput}
                    onChange={event => (
                        setLichessInput(event.target.value)
                    )}
                />
            </label>

            <div className={styles.editorButtons}>
                <button
                    className={styles.saveButton}
                    onClick={saveAccounts}
                >
                    {t("recentGames.saveButton")}
                </button>

                <button
                    className={styles.cancelButton}
                    onClick={() => setEditing(false)}
                >
                    {t("recentGames.cancelButton")}
                </button>
            </div>
        </div>}

        {!anyAccountLinked && !editing && <div className={styles.hint}>
            {t("recentGames.linkHint")}
        </div>}

        {anyAccountLinked && <>
            <div className={styles.sourceRow}>
                {chessCom && <button
                    className={styles.sourceButton}
                    data-active={source == "chessCom"}
                    onClick={() => setSource("chessCom")}
                >
                    Chess.com • {chessCom}
                </button>}

                {lichess && <button
                    className={styles.sourceButton}
                    data-active={source == "lichess"}
                    onClick={() => setSource("lichess")}
                >
                    Lichess • {lichess}
                </button>}
            </div>

            <div className={styles.list}>
                {status == "pending" && <div className={styles.loading}>
                    <Loader/>
                </div>}

                {status == "error" && <LogMessage>
                    {t("recentGames.fetchError")}
                </LogMessage>}

                {status == "success" && (games.length > 0
                    ? games.map(game => <GameListing
                        key={game.pgn}
                        game={game}
                        perspective={username
                            ? getColourPlayed(game, username)
                            : PieceColour.WHITE
                        }
                        onClick={selectGame}
                    />)
                    : <div className={styles.hint}>
                        {t("recentGames.noGames")}
                    </div>
                )}
            </div>
        </>}
    </div>;
}

export default RecentGames;
