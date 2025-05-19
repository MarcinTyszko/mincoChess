import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { trim } from "lodash";

import { Game } from "wintrchess";
import {
    GameSource,
    GameSourceType,
    GameSelectorButton
} from "@components/chess/GameSelector/GameSource";
import useGameSelector from "@hooks/useGameSelector";
import Button from "@components/common/Button";
import FileUploader from "@components/common/FileUploader";
import GameSearchMenu from "../GameSearchMenu";

import GameSelectorProps from "./GameSelectorProps";
import * as styles from "./GameSelector.module.css";

const sourcePlaceholderKeys: Record<GameSourceType, string> = {
    PGN: "pgn",
    FEN: "fen",
    CHESS_COM: "chessCom",
    LICHESS: "lichess"
};

function GameSelector({
    style,
    saveLocalStorage,
    onGameSelect
}: GameSelectorProps) {
    const { t } = useTranslation();

    const {
        savedGameSource,
        setSavedGameSource,
        savedFieldInputs,
        setSavedFieldInput
    } = useGameSelector();

    const [ gameSource, setGameSource ] = useState(
        saveLocalStorage ? savedGameSource : GameSource.PGN
    );

    const [
        fieldInputs,
        setFieldInputs
    ] = useState(saveLocalStorage ? savedFieldInputs : {});

    const currentFieldInput = useMemo(() => (
        fieldInputs[gameSource.key] || ""
    ), [gameSource.key, fieldInputs]);

    const [
        serviceGames,
        setServiceGames
    ] = useState<Record<string, Game | null>>({
        [GameSource.CHESS_COM.key]: null,
        [GameSource.LICHESS.key]: null
    });

    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    // Emit selected game when it updates
    useEffect(() => {
        if (gameSource.selectorButton == GameSelectorButton.SEARCH_GAMES) {
            return onGameSelect?.(serviceGames[gameSource.key]);
        }

        onGameSelect?.(currentFieldInput || null);
    }, [currentFieldInput, serviceGames]);

    function updateFieldInput(value: string) {
        const updatedFieldInputs = {
            ...fieldInputs,
            [gameSource.key]: value
        };

        setFieldInputs(updatedFieldInputs);

        if (!saveLocalStorage) return;
        setSavedFieldInput(gameSource.key, value);
    }

    function openGameSearchMenu() {
        if (currentFieldInput.length == 0) return;

        setSearchMenuOpen(true);
    }

    return <div className={styles.wrapper} style={style}>
        <div className={styles.gameSourceSection}>
            <div className={styles.gameSourceLabel}>
                {t("pages.analysis.gameSelector.sourceLabel")}
            </div>

            <select
                className={styles.gameSourceSelector}
                onChange={event => {
                    const newGameSource = Object.values(GameSource).find(
                        source => source.key == event.target.value
                    ) || GameSource.PGN;

                    setGameSource(newGameSource);

                    if (!saveLocalStorage) return;
                    setSavedGameSource(newGameSource.key);
                }}
                value={gameSource.key}
            >
                {Object.values(GameSource)
                    .map(source => <option value={source.key}>
                        {source.title}
                    </option>)
                }
            </select>
        </div>

        <textarea
            className={styles.selectorField}
            placeholder={t(
                "pages.analysis.gameSelector.sourcePlaceholders."
                + sourcePlaceholderKeys[gameSource.key]
            )}
            style={{
                height: gameSource.expandField ? "170px" : "70px",
                borderRadius: gameSource.selectorButton != undefined
                    ? undefined : "0 0 10px 10px"
            }}
            value={currentFieldInput}
            onChange={event => updateFieldInput(event.target.value)}
            onKeyDown={event => {
                if (event.key != "Enter") return;
                if (
                    gameSource.selectorButton
                    != GameSelectorButton.SEARCH_GAMES
                ) return;

                event.preventDefault();
                openGameSearchMenu();
            }}
        />

        {gameSource.selectorButton == GameSelectorButton.SEARCH_GAMES
            && <Button
                className={styles.selectorButton}
                icon={require("@assets/img/interface/search.svg")}
                iconSize="25px"
                onClick={openGameSearchMenu}
            >
                {t("pages.analysis.gameSelector.searchGamesButton")}
            </Button>
        }

        {gameSource.selectorButton == GameSelectorButton.UPLOAD_FILE
            && <FileUploader
                extensions={[".pgn"]}
                onFilesUpload={async files => {
                    const pgn = await files.item(0)?.text();
                    if (!pgn) return;

                    updateFieldInput(pgn);
                }}
            >
                <Button
                    className={styles.selectorButton}
                    icon={require("@assets/img/interface/upload.svg")}
                    iconSize="25px"
                >
                    {t("pages.analysis.gameSelector.uploadPGNButton")}
                </Button>
            </FileUploader>
        }
        
        {searchMenuOpen
            && <GameSearchMenu
                username={trim(currentFieldInput)}
                gameSource={gameSource}
                setOpen={setSearchMenuOpen}
                onGameSelect={game => {
                    setServiceGames({
                        ...serviceGames,
                        [gameSource.key]: game
                    });
                }}
            />
        }
    </div>;
}

export default GameSelector;