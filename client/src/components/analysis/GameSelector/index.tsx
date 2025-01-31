import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cookies } from "react-cookie";

import { Cookie, Game } from "wintrchess";
import GameSource from "@constants/GameSource";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import GameSearchMenu from "../GameSearchMenu";
import parsePgn from "@lib/games/pgn";
import parseFenString from "@lib/games/fen";

import GameSelectorProps from "./GameSelectorProps";
import * as styles from "./GameSelector.module.css";

function GameSelector({
    style,
    saveCookies,
    onChange,
    setError
}: GameSelectorProps) {
    const { t } = useTranslation();
    
    const cookies = new Cookies();

    const [ gameSource, setGameSource ] = useState(GameSource.PGN);
    const [ fieldInput, setFieldInput ] = useState("");

    const [ selectedServiceGame, setSelectedServiceGame ] = useState<Game>();

    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    function getSavedFieldInput(source: GameSource): string | undefined {
        return cookies.get(
            Cookie.LAST_GAME_SELECTOR_INPUTS
        )?.[source.key];
    }

    // Parse an entered PGN or FEN and emit it when input changes
    useEffect(() => {
        if (gameSource.requiresSearch) {
            return selectedServiceGame
                ? onChange?.(selectedServiceGame)
                : setError?.(
                    t("pages.analysis.gameSelector.errors.noGameSelected")
                );
        }

        if (fieldInput.length == 0) {
            return setError?.(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        try {
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
    }, [gameSource, fieldInput]);

    // Load saved values from cookies
    useEffect(() => {
        // Load last game source from cookies
        const savedSourceKey = cookies.get(Cookie.LAST_GAME_SELECTOR_SOURCE);

        const savedSource = Object.values(GameSource)
            .find(source => source.key == savedSourceKey);

        if (!savedSource) return;

        setGameSource(savedSource);

        // Load last selector input from cookies
        const savedFieldInput = getSavedFieldInput(savedSource);

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

        // Save the selected game source choice in cookies
        if (saveCookies) {
            cookies.set(Cookie.LAST_GAME_SELECTOR_SOURCE, selectedSource.key);
        }

        // Put the saved selector input from cookies into the text area
        const savedFieldInput = getSavedFieldInput(selectedSource);
        
        if (!savedFieldInput) return;

        setFieldInput(savedFieldInput);
    }

    function handleFieldInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setFieldInput(event.target.value);

        // Save the input field contents in cookies
        if (!saveCookies) return;

        let savedSelectorInputs = cookies.get(Cookie.LAST_GAME_SELECTOR_INPUTS) || {};
        if (typeof savedSelectorInputs != "object") {
            savedSelectorInputs = {};
        }

        cookies.set(
            Cookie.LAST_GAME_SELECTOR_INPUTS,
            {
                ...savedSelectorInputs,
                [gameSource.key]: event.target.value
            }
        );
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
                {
                    Object.values(GameSource)
                        .map(source => <option value={source.key}>
                            {source.title}
                        </option>)
                }
            </select>
        </div>

        <textarea
            className={styles.selectorField}
            placeholder={
                t(`pages.analysis.gameSelector.sourcePlaceholders.${gameSource.key}`)
            }
            style={{
                height: gameSource.expandField ? "170px" : "70px",
                borderRadius: gameSource.requiresSearch ? undefined : "0 0 10px 10px"
            }}
            value={fieldInput}
            onChange={handleFieldInputChange}
        ></textarea>

        {
            gameSource.requiresSearch
            && <Button
                icon={require("@assets/img/search.svg")}
                iconSize="25px"
                style={{
                    backgroundColor: ButtonColour.LIGHT_GREY,
                    borderRadius: "0 0 10px 10px"
                }}
                onClick={openGameSearchMenu}
            >
                {t("pages.analysis.gameSelector.searchGamesButton")}
            </Button>
        }
        
        {
            searchMenuOpen
            && <GameSearchMenu
                username={fieldInput}
                gameSource={gameSource}
                setOpen={setSearchMenuOpen}
                setSelectedGame={setSelectedServiceGame}
            />
        }
    </div>;
}

export default GameSelector;