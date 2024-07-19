import React from "react";

import { GamePlayerProfile, Game, GameResult } from "wintrchess";
import GameListing from "@components/common/GameListing";

import * as styles from "./Archive.module.css";

function Archive() {
    const whitePlayer: GamePlayerProfile = {
        username: "Levy Rozman",
        title: "IM",
        rating: 2330,
        image: "URL_TO_LEVY_PICTURE", // Add the actual URL to the player"s picture
        result: GameResult.LOSE,
        accuracy: 87.5
    };

    const blackPlayer: GamePlayerProfile = {
        title: "GM",
        image: "URL_TO_MAGNUS_PICTURE", // Add the actual URL to the player"s picture
        result: GameResult.WIN
    };

    const game: Game = {
        pgn: "",
        initialPosition: "",
        variant: "standard",
        players: {
            white: whitePlayer,
            black: blackPlayer
        }
    };

    return <div className={styles.wrapper}>
        <div className={styles.gameListingContainer}>
            <GameListing
                game={game}
                moveCount={47}
            />
        </div>
    </div>;
}

export default Archive;
