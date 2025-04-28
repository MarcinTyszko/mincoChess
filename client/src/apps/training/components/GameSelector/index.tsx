import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { trim } from "lodash";

import { Game } from "wintrchess";
import useLocalStorage from "@hooks/useLocalStorage";
import LocalStorageKey from "@constants/LocalStorageKey";
import { GameSelectorButton, GameSource, GameSourceType } from "@constants/GameSource";
import Button from "@components/common/Button";
import FileUploader from "@components/common/FileUploader";
import GameSearchMenu from "../GameSearchMenu";
import parsePgn from "@lib/games/pgn";
import parseFenString from "@lib/games/fen";

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
    saveCookies,
    onChange,
    setError
}: GameSelectorProps) {
    const { t } = useTranslation();

    const {
        value: savedGameSourceKey,
        set: setSavedGameSourceKey
    } = useLocalStorage<string>(LocalStorageKey.LAST_GAME_SELECTOR_SOURCE);

    const {
        parsedValue: savedFieldInputs,
        set: setSavedFieldInputs
    } = useLocalStorage<Record<string, string>>(LocalStorageKey.LAST_GAME_SELECTOR_INPUTS);

    const [ gameSource, setGameSource ] = useState(GameSource.PGN);
    const [ fieldInput, setFieldInput ] = useState("");

    const [ selectedServiceGame, setSelectedServiceGame ] = useState<Game>();

    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    // When selected game changes
    useEffect(() => {
        if (gameSource.selectorButton == GameSelectorButton.SEARCH_GAMES) {
            if (selectedServiceGame) {
                onChange?.(selectedServiceGame);
                setError?.();
            } else {
                setError?.(
                    t("pages.analysis.gameSelector.errors.noGameSelected")
                );
            }

            return;
        }

        if (fieldInput.length == 0) {
            return setError?.(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        try {
            // Attempt to emit parsed PGN or FEN
            onChange?.(
                gameSource == GameSource.PGN
                    ? parsePgn(fieldInput)
                    : parseFenString(fieldInput)
            );

            setError?.();
        } catch (err) {
            setError?.(
                t("pages.analysis.gameSelector.errors.invalidGame")
            );
        }
    }, [gameSource, fieldInput, selectedServiceGame]);

    // Load saved values from cookies
    useEffect(() => {
        if (!saveCookies) return;

        // Load last game source from cookies
        const savedSource = Object.values(GameSource)
            .find(source => source.key == savedGameSourceKey);

        if (!savedSource) return;

        setGameSource(savedSource);

        // Load last selector input from cookies
        const savedFieldInput = savedFieldInputs[savedSource.key];
        
        if (!savedFieldInput) return;
        
        setFieldInput(savedFieldInput);
    }, []);

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        // Get the selected game source from the dropdown
        const selectedSource = Object.values(GameSource)
            .find(source => source.key == event.target.value);
        
        if (!selectedSource) return;

        // Save the selected game source choice in state
        setGameSource(selectedSource);

        if (saveCookies) {
            // Save the selected game source choice in cookies
            setSavedGameSourceKey(selectedSource.key);

            // Put the saved selector input from cookies into the text area
            setFieldInput(savedFieldInputs[selectedSource.key] || "");
        }  
    }

    function handleFieldInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setFieldInput(event.target.value);

        // Save the input field contents in cookies
        if (!saveCookies) return;

        setSavedFieldInputs({
            ...savedFieldInputs,
            [gameSource.key]: event.target.value
        });
    }

    function openGameSearchMenu() {
        if (fieldInput.length == 0) return;

        setSearchMenuOpen(true);
    }

    return <div className={styles.wrapper} style={style}>
        <div className={styles.gameSourceSection}>
            <div className={styles.gameSourceLabel}>
                {t("pages.analysis.gameSelector.sourceLabel")}
            </div>

            <select 
                className={styles.gameSourceSelector}
                onChange={handleGameSourceChange}
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
            value={fieldInput}
            onChange={handleFieldInputChange}
        ></textarea>

        {
            gameSource.selectorButton == GameSelectorButton.SEARCH_GAMES
            && <Button
                className={styles.selectorButton}
                icon={require("@assets/img/interface/search.svg")}
                iconSize="25px"
                onClick={openGameSearchMenu}
            >
                {t("pages.analysis.gameSelector.searchGamesButton")}
            </Button>
        }

        {
            gameSource.selectorButton == GameSelectorButton.UPLOAD_FILE
            && <FileUploader
                extensions={[".pgn"]}
                onFilesUpload={async files => {
                    const pgn = await files.item(0)?.text();
                    if (!pgn) return;

                    setFieldInput(pgn);
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
        
        {
            searchMenuOpen
            && <GameSearchMenu
                username={trim(fieldInput)}
                gameSource={gameSource}
                setOpen={setSearchMenuOpen}
                setSelectedGame={setSelectedServiceGame}
            />
        }
    </div>;
}

export default GameSelector;